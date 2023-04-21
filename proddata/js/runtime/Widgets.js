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
 * Widgets Class
 * A collection of defined widgets, including user-defined ones.
 * @constructor
 */
pui.Widgets = function () {
  // private variables
  this._widgetArray = []; // List of widgets that can be iterated over for "field type" menu entries, etc.
};

// private functions

/**
 * Generate what "id" will be used on a new instance of the widget, based on the name of the widget; i.e. capitalize the widget name words.
 * @param {String} name
 * @returns {String}
 */
pui.Widgets.prototype._deriveNewId = function (name) {
  var words = name.split(" ");
  var newId = "";
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    word = word.charAt(0).toUpperCase() + word.substr(1); // Capitalize
    newId += word;
  }
  return newId;
};

/**
 * Generate a menu name for the widget based on the widget name.
 * @param {String} name
 * @returns {String}
 */
pui.Widgets.prototype._deriveMenuName = function (name) {
  var words = name.split(" ");
  var menuName = "";
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    word = word.charAt(0).toUpperCase() + word.substr(1); // Capitalize
    if (menuName != "") menuName += " ";
    menuName += word;
  }
  return menuName;
};

// public methods
pui.Widgets.prototype.getAllWidgets = function () {
  return this._widgetArray;
};

/**
 * Return a list of all widget config objects for the current context.
 * @param {Boolean|undefined} fullList
 * @returns {Array.<Object>}
 */
pui.Widgets.prototype.getWidgetList = function (fullList) {
  if (fullList == null) fullList = true;
  var list = [];
  for (var i = 0; i < this._widgetArray.length; i++) {
    var widget = this._widgetArray[i];
    if (widget.context != null && widget.context != context) continue;
    if (fullList || (!widget.customSizing && widget.name != "layout")) list.push(widget.name);
  }
  list.sort();
  return list;
};

/**
 * @returns {Array.<String>}
 */
pui.Widgets.prototype.getMenuOptions = function () {
  var menu = [];
  for (var i = 0; i < this._widgetArray.length; i++) {
    var menuName = this._widgetArray[i].menuName;
    if (typeof menuName == "string") {
      menu.push(menuName);
    }
    else { // multiple names
      for (var j = 0; j < menuName.length; j++) {
        menu.push(menuName[j]);
      }
    }
  }
  menu.sort();
  return menu;
};

/**
 * Find a widget config object given its menu name.
 * @param {String|Array.<String>} menuName
 * @returns {Object}
 */
pui.Widgets.prototype.getWidgetByMenuName = function (menuName) {
  for (var i = 0; i < this._widgetArray.length; i++) {
    var widget = this._widgetArray[i];
    if (typeof widget.menuName == "string") {
      if (menuName == widget.menuName) return widget;
    }
    else { // multiple names
      for (var j = 0; j < widget.menuName.length; j++) {
        if (menuName == widget.menuName[j]) return widget;
      }
    }
  }
  return null;
};

/**
 * Add a widget to the global list, and set default values on any unconfigured properties. (API)
 * @param {Object} obj
 */
pui.Widgets.prototype.add = function (obj) {
  var name = obj.name;
  if (name != null) {
    // assign defaults
    if (obj.newId == null) obj.newId = this._deriveNewId(name);
    if (obj.menuName == null) obj.menuName = this._deriveMenuName(name);
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

    // If the argument includes a constructor or two required functions for BasicWidgets, then use our globalPropertySetter,
    // which constructs the BasicWidget to interface the custom code with our framework. Note: if the customer specified a
    // globalPropertySetter, then it is discarded. There can only be one... their subclass can implement 'setProperty', if necessary.
    if (typeof obj["constr"] === "function" || (typeof obj["render"] === "function" && typeof obj["getValue"] === "function")) {
      obj.globalPropertySetter = this.bidirGlobalPropertySetter;
    }

    // add widget
    this._widgetArray.push(obj);
    this[name] = obj;
    // Update the properties model with the new field type.
    if (!pui.codeBased) getPropertiesNamedModel()["field type"].choices = this.getWidgetList(false);
  }
};

/**
 * Add a mapping from a widget name to an input property so that a widget can tell pui.buildResponse and pui.renderFormat
 * that a property takes input. Called when a bidirectional property is passed to pui.addCustomProperty.
 * @param {String} widgetName
 * @param {String} propName
 */
pui.Widgets.prototype.mapInputProp = function (widgetName, propName) {
  if (this[widgetName]) {
    var inputProps = this[widgetName].inputProps;
    if (inputProps == null) inputProps = this[widgetName].inputProps = {};
    inputProps[propName] = true;
  }
};

/**
 * Generic globalPropertySetter for bi-directional widgets. Constructs a new instance upon applyProperty "field type".
 * Note: This function's "this" is not bound when this function is assigned to other objects; so, pui.widgets[widgetName] is used instead.
 *
 * Note: properties can be set at any point in designer when configuring a widget or in runtime when the applyProperty API is called.
 * In runtime rendering, the "field type" property is always set first. (All property values not set by APIs are known at that time,
 * so all properties could be setup in the BasicWidget's constructor.)
 * pui.renderFormat and many Designer methods call BasicWidget's "render" after setting all properties.
 * @param {SetterParms} parms
 */
pui.Widgets.prototype.bidirGlobalPropertySetter = function (parms) {
  var puiwidget;
  if (parms.dom && parms.dom.pui && parms.dom.pui.widget) puiwidget = parms.dom.pui.widget;

  if (parms.propertyName == "field type") {
    var widgetName = parms.value;
    if (puiwidget != null && typeof puiwidget.destroy === "function") {
      puiwidget.destroy();
    }

    if (pui.widgets[widgetName] != null) {
      var widgetConfig = pui.widgets[widgetName];

      if (typeof widgetConfig["constr"] === "function") {
        try {
          // The custom widget uses a subclass of pui.BasicWidget, which implements necessary methods.
          puiwidget = new widgetConfig["constr"](parms, widgetName);
        }
        catch (exc) { console.log(exc); } // In case the custom constructor throws exceptions it's nicer to keep rendering and not halt.
      }
      else {
        puiwidget = new pui.BasicWidget(parms, widgetName);

        // To the BasicWidget attach the supplied functions. Bind so that they can reach class methods and properties easily.
        if (typeof widgetConfig["render"] === "function") puiwidget["render"] = widgetConfig["render"].bind(puiwidget);
        if (typeof widgetConfig["getValue"] === "function") puiwidget["getValue"] = widgetConfig["getValue"].bind(puiwidget);
      }
    }
  }

  try {
    if (puiwidget) {
      // Always call the superclass's setProperty before a subclass's setProperty, if that is defined.
      pui.BasicWidget.prototype.basicSetProperty.call(puiwidget, parms);
      if (typeof puiwidget["setProperty"] === "function") puiwidget["setProperty"](parms);
    }
  }
  catch (exc) { console.log(exc); }
};

pui.widgets = new pui.Widgets();

/**
 * Build a list of style choices for the "button style" property of the "styled button" widget.
 * @returns {Array.<Object>}
 */
pui.widgets.getButtonStyles = function () {
  var buttonStyleArray = [];
  for (var buttonStyle in pui.widgets.buttonStyles) {
    buttonStyleArray.push(buttonStyle);
  }
  return buttonStyleArray;
};

/**
 * Build a list of style choices for the "panel style" property of the "panel" widget.
 * @returns {Array.<Object>}
 */
pui.widgets.getPanelStyles = function () {
  var panelStyleArray = [];
  for (var panelStyle in pui.widgets.panelStyles) {
    panelStyleArray.push(panelStyle);
  }
  return panelStyleArray;
};

/**
 * Build a list of chart choices for the "chart type" property of the "chart" widget.
 * @returns {Array.<String>}
 */
pui.widgets.getChartTypes = function () {
  return pui.widgets.chartTypes;
};

/**
 * Build a list of style choices for the "tab panel style" property of the "tab panel" widget.
 * @returns {Array.<Object>}
 */
pui.widgets.getTabStyles = function () {
  var tabStyleArray = [];
  for (var tabStyle in pui.widgets.tabStyles) {
    tabStyleArray.push(tabStyle);
  }
  tabStyleArray.push("Other...");
  return tabStyleArray;
};

/**
 * A base class for allowing custom widgets to work like built-in, Profound UI widgets. #3703. The class can be used two ways.
 * 1) subclasses implement render and getValue and must do this in their constructors: pui.BasicWidget.call(this, parms, widgetName);
 * 2) the argument to pui.widgets.add() gets a "render" and a "getValue" function.
 *
 * Public methods available: init, render (required), getValue (required), cleanup, evalProperty, handleEvent.
 *
 * @param {SetterParms} parms  The argument to the "field type" property setter that constructs this object.
 * @param {String} widgetName  Name needed for looking in pui.widgets for a list of input properties.
 * @constructor
 * @returns {pui.BasicWidget}
 */
pui.BasicWidget = function (parms, widgetName) {
  // Public.
  // The widget name gets stored under a non-enumerable, non-writable, configurable property: widgetName.
  Object.defineProperties(this, {
    widgetName: {
      value: widgetName,
      "configurable": true
    }
  });
  this.design = parms.design;
  this._designItem = parms.designItem; // Needed by mirrorDown in render.

  // The DIV element in the DOM that will contain this widget. (Note: "dom" is in externs and will not be obfuscated.)
  this.dom = parms.dom;

  // Private
  // info needed by evalProperty: collection of properties and original values.
  this._properties = parms.properties;
  this._originalValues = {};
  this._originalValues[parms.propertyName] = parms.originalValue;

  // Mapping of property names, with fieldNames as keys. Note: by using mappings the widget can support multiple different bound
  // input fields under various property names, not just under "value". Each property can support one field.
  this._fieldMap = {};

  // Mapping of formatting objects with property names as keys. For each bound property there exists up to one format.
  this._formatMap = {};

  if (this.dom.pui == null) this.dom.pui = {};
  this.dom.pui.widget = this;

  // Causes this.destroy to be called at the beginning of pui.render: old instances of BasicWidget get destroyed.
  pui.widgetsToCleanup.push(this);
};
pui.BasicWidget.prototype = Object.create(pui.BaseClass.prototype);

/**
 * Remove everything in the DIV, delete all object properties, and call a 'cleanup' method if any subclasses implement it.
 * The DIV cannot be removed from the DOM here; Genie needs the element to remain when switching in and out of design mode.
 */
pui.BasicWidget.prototype.destroy = function () {
  if (this.dom != null) {
    this.dom.innerHTML = "";
    this.dom.removeEventListener("input", this);
    this.dom.removeEventListener("change", this);
  }
  // Allow subclasses to implement a cleanup method that would run before another renderFormat runs.
  try {
    if (typeof this["cleanup"] === "function") this["cleanup"]();
  }
  catch (exc) { console.log(exc); }
  this.deleteOwnProperties();
};

/**
 * Wrapper for a function to update the DOM using internal data. Profound UI calls basicRender in about 14 places--after
 * setting all properties; i.e. in renderFormat after all properties are set and in similar places in Designer.
 */
pui.BasicWidget.prototype.basicRender = function () {
  try {
    if (typeof this["render"] === "function") this["render"]();
  }
  catch (exc) { console.log(exc); }

  // If the item is inside a grid, then make sure it gets rendered for each cell, not just the first.
  if (this.design && this._designItem) {
    this._designItem.mirrorDown();
  }
};

/**
 * Returns true if the specified property name is input capable. Assume 'value' is always input capable when bound.
 * (Called in pui.renderFormat for bound values.)
 * Pre-Condition: pui.widgets is setup.
 * @param {String} propName
 * @returns {Boolean}
 */
pui.BasicWidget.prototype.isInputCapableProp = function (propName) {
  var wn = this.widgetName;
  return propName == "value" ||
    (wn && pui.widgets[wn] && pui.widgets[wn].inputProps && pui.widgets[wn].inputProps[propName] === true);
};

/**
 * Set an internal mapping between a property name and a qualified field name. Also save the formatting object. (Called during pui.renderFormat)
 * @param {String} propname
 * @param {Object} formattingObj
 * @param {String} fieldName
 */
pui.BasicWidget.prototype.setFormattingObj = function (propname, formattingObj, fieldName) {
  this._formatMap[propname] = formattingObj;
  this._fieldMap[fieldName] = propname;
};

/**
 * Returns formatting object for given field name. (Called during pui.buildResponse.)
 * Note: sometimes renderFormat does not call setFormattingObj, so _fieldMap is not set; e.g. tag is "input" with inputType: "button". So,
 * we test for the fieldMap entry before using it. Also, renderFormat stored the format elsewhere, in that case.
 * @param {String} fieldName
 * @returns {Object|undefined}
 */
pui.BasicWidget.prototype.getFormattingObj = function (fieldName) {
  var propname = this._fieldMap[fieldName];
  if (propname) {
    return this._formatMap[propname];
  }
};

/**
 * Return the current property value for a given property name. Returns a string when the value exists, attempting to format if possible.
 * Needed by this.getFieldValue. Can be called by our framework's getElementValue API (i.e. "get") with the argument, "value".
 * @param {String|undefined|Null} propname
 * @returns {undefined|String}
 */
pui.BasicWidget.prototype.getPropertyValue = function (propname) {
  var returnVal;
  if (propname != null) {
    var format = this._formatMap[propname];
    try {
      returnVal = this["getValue"](propname);
      if (typeof returnVal === "number" || typeof returnVal === "boolean") returnVal = String(returnVal);
      else if (returnVal instanceof Date) {
        if (format != null && typeof format.dateFormat === "string") {
          if (isNaN(returnVal.getYear())) returnVal = "";
          else returnVal = returnVal.format(format.dateFormat);
        }
        else returnVal = returnVal.toISOString(); // with no format, try using just the ISO date string.
      }
      else if (returnVal == null) returnVal = "";
    }
    catch (exc) { console.log(exc); }
  }
  return returnVal;
};

/**
 * Lookup and return the value of a bound field property given the fieldName. Returns a string when the value exists, else returns
 * undefined. (Called by pui.buildResponse)
 * @param {String} fieldName
 * @returns {undefined|String}
 */
pui.BasicWidget.prototype.getFieldValue = function (fieldName) {
  var propname = this._fieldMap[fieldName];
  return this.getPropertyValue(propname);
};

/**
 * Evaluate the value of a property. Useful when rendering for the first time or in design mode. Can handle values set with "js: ...".
 * Subclasses that override this should call this version first; e.g. pui.BasicWidget.prototype.evalProperty.call(this, propname);
 * @param {String} propname
 * @returns {String}
 */
pui.BasicWidget.prototype["evalProperty"] = function (propname) {
  return evalPropertyValue(this._properties[propname], this._originalValues[propname], this.dom);
};

/**
 * Get the current value of a property. Needed when building a screen response.
 * Placeholder function for subclasses to implement or to be overridden in pui.widgets.add config.
 * Returns property value or empty string.
 * @param {String} propname
 * @returns {String}
 */
pui.BasicWidget.prototype["getValue"] = function (propname) {
  return this["evalProperty"](propname);
};

/**
 * Handle any properties being set by the bidirGlobalSetter. Store properties so that evalProperty can be called.
 * @param {SetterParms} parms
 */
pui.BasicWidget.prototype.basicSetProperty = function (parms) {
  var propName = parms.propertyName;
  this.design = parms.design;
  this._properties = parms.properties;
  this._originalValues[parms.propertyName] = parms.originalValue;

  if (!this.design) {
    var tmpval = this["evalProperty"](propName);
    // Catch changes made via applyProperty that modify the widget input values.
    if (tmpval !== parms.value && this.isInputCapableProp(propName)) this.dom.modified = true;
  }
};

/**
 * Event listener to handle change events, ensuring that fields are submitted to the server when modified.
 * Listeners should be registered like: this.dom.addEventListener('change', this);
 * Subclasses may override and implement more listeners but should always set the "modified" property of this.dom in order for a
 * value to be included in a screen response.
 * @param {Event} e
 */
pui.BasicWidget.prototype["handleEvent"] = function (e) {
  switch (e.type) {
    case "input":
    case "change":
      this.dom.modified = true;
      break;
  }
};
