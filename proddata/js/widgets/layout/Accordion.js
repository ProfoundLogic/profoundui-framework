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
 * Accordion Class
 * This has been reworked to fix some bugs and is now a subclass of pui.layout.Template, like TabLayout and others.
 * Some vestiges of the old code may still be in the Layout class and could be simplified eventually.
 * @param {Object} parms  Property setter parameters.
 * @param {Element} dom   A new or cloned DIV element.
 * @constructor
 */
pui.Accordion = function(parms, dom) {
  pui.layout.Template.call(this, parms, dom); // sets this.container=dom, this.forProxy, this.designMode, etc.

  this.INITIALLIST = pui["getLanguageText"]("runtimeText", "section") + " 1," +
    pui["getLanguageText"]("runtimeText", "section") + " 2," +
    pui["getLanguageText"]("runtimeText", "section") + " 3";

  // Private properties.

  this._headerDivs = [];
  this._bodyDivs = [];
  this._headerButtons = [];
  this._bodyPanels = [];

  this._straightEdge = "none";
  this._headerSwatch = "b";
  this._bodySwatch = "c";
  this._expandedSection = -1;
  this._allowCollapse = false;

  this._addIcon = null;
  this._removeIcon = null;

  this._sections = []; // List of names for section labels.

  // Allow one function to be re-used for elements created in loops, and their "this" points to the correct object.
  this._boundHeaderOnClick = this._headerOnClick.bind(this);

  this.init();

  this.container.sizeMe = this.resize.bind(this);
  if (this.layout && this.layout.layoutDiv) this.layout.layoutDiv.sizeMe = this.resize.bind(this);

  var properties = parms.properties;

  var sectionNames = properties["section names"];

  // PUI-213: when the layout contains widgets and the template changed, then make sure widgets can move to the new layout.
  // Note: if the user switched the layout from another template, then sectionNames should always be unset.
  if (parms.lastContWithWidget > 3 && (typeof sectionNames !== "string" || sectionNames.length === 0)) {
    sectionNames = this.INITIALLIST;
    var len = sectionNames.split(",").length; // 3.

    // Add enough sections for the widgets.
    for (var nextn = len + 1, n = parms.lastContWithWidget; nextn <= n; nextn++) {
      sectionNames += "," + pui["getLanguageText"]("runtimeText", "section") + " " + nextn;
    }

    this.setProperty("section names", sectionNames);

    // In designer you must also update the design property, or else when you save, then the new tab is lost.
    this.layout.updatePropertyInDesigner("section names", sectionNames);
  }
  else {
    this.setProperty("section names", sectionNames);
  }

  this.expandSection(0); // also calls me.resize().

  var headerTheme = properties["header theme"];
  if (headerTheme != null) this.setHeaderSwatch(headerTheme);

  var bodyTheme = properties["body theme"];
  if (bodyTheme != null) this.setBodySwatch(bodyTheme);

  this.setStraightEdge(properties["straight edge"]);

  var mini = properties["small sections"];
  mini = (mini === "true" || mini === true);
  this.setMini(mini);

  this.setAllStyles(properties);

  var height = properties["height"];
  if (height == null) height = "300px";
  this.setHeight(height);

  if (!this.designMode) {
    var activeSection = properties["active section"];
    if (activeSection != null) {
      activeSection = Number(activeSection);
      if (!isNaN(activeSection) && activeSection != 0) {
        this.expandSection(activeSection);
      }
    }
  }

  if (this.forProxy) {
    this.container.style.position = "relative";
  }

  // PUI-213: when the layout contains widgets and the template changed, then make sure widgets can move to the accordion.
  if (parms.lastContWithWidget > 0) this.render();
};
pui.Accordion.prototype = Object.create(pui.layout.Template.prototype);

Object.defineProperties(pui.Accordion.prototype, {
  TXT_CANNOTREMOVE: { value: "The section cannot be removed because it contains other elements that must be removed first." }
});

//
// Public methods.
//

/**
 *
 */
pui.Accordion.prototype.init = function() {
  this.container.style.overflow = "hidden";
};

/**
 * Render the layout in the DOM. Called once in runtime, after all properties are set, (eventually) allowing simpler handling of properties.
 * In Designer, this can be called as the user sets any property in the Properties Window.
 * Overrides pui.layout.Template.render.
 * @param {Object|undefined} screenParms   Parameters sent to renderFormat that are not passed in property setters. Undefined when called in Designer.
 *   See TabLayout.render for how screenParms may be utilized.
 * @public
 */
pui.Accordion.prototype.render = function(screenParms) {
  var names = this._sections;

  // Append elements when the number of sections increased.
  var numSectionsDesired = names.length;
  var nextId = this._headerDivs.length;

  while (numSectionsDesired > this._headerDivs.length) {
    var headerDiv = document.createElement("div");
    headerDiv.style.width = "100%";
    headerDiv.style.padding = "0";
    headerDiv.sectionNumber = nextId;
    headerDiv.onclick = this._boundHeaderOnClick;

    var bodyDiv = document.createElement("div");
    bodyDiv.style.width = "100%";
    bodyDiv.style.height = "175px";
    bodyDiv.style.padding = "0";

    var headerButton = new pui.CSSButton();
    headerButton.container = headerDiv;
    headerButton.forProxy = this.forProxy;
    headerButton.init();
    headerButton.setSwatch(this._headerSwatch);
    headerButton.setIcon("plus");
    headerButton.setIconPosition("left");

    var bodyPanel = new pui.CSSPanelSection();
    bodyPanel.type = "body";
    bodyPanel.forLayout = true;
    bodyPanel.container = bodyDiv;
    bodyPanel.init();
    bodyPanel.setSwatch(this._bodySwatch);
    bodyPanel.setHeight("100%");

    this.container.appendChild(headerDiv);
    this.container.appendChild(bodyDiv);

    this._headerDivs.push(headerDiv);
    this._bodyDivs.push(bodyDiv);
    this._headerButtons.push(headerButton);
    this._bodyPanels.push(bodyPanel);

    nextId++;
  }

  // Remove elements when the number of tabs decreased.
  while (numSectionsDesired < this._headerDivs.length) {
    var headerDiv = this._headerDivs.pop();
    this.container.removeChild(headerDiv);

    var bodyDiv = this._bodyDivs.pop();
    this.container.removeChild(bodyDiv);

    this._headerButtons.pop();
    this._bodyPanels.pop();
  }

  for (var i = 0, n = names.length; i < n; i++) {
    this._headerButtons[i].setText(names[i]);

    // Hide overflow on all but the last.
    this._bodyDivs[i].style.overflow = (i < names.length - 1) ? "hidden" : "";
  }

  // Add icons to the container DOM element if they are not already.
  if (this.designMode) {
    if (this._addIcon == null) {
      // Add the + (add) button.
      this._addIcon = designUtils.createAndAppendIcon("plus",
        pui["getLanguageText"]("runtimeText", "add x", [pui["getLanguageText"]("runtimeText", "section")]),
        this.container);
      this._addIcon.style.right = "2px";
      this._addIcon.style.bottom = "2px";
      this._addIcon.onclick = this._addrmvIconOnclick.bind(this);
      this._addIcon.adding = true;
    }
    else {
      // Make sure the icon is after the bodies.
      this.container.appendChild(this._addIcon);
    }

    // Add the - (remove) button.
    if (this._removeIcon == null) {
      this._removeIcon = designUtils.createAndAppendIcon("minus",
        pui["getLanguageText"]("runtimeText", "delete x", [pui["getLanguageText"]("runtimeText", "section")]),
        this.container);
      this._removeIcon.style.right = "2px";
      this._removeIcon.style.bottom = "16px";
      this._removeIcon.onclick = this._addrmvIconOnclick.bind(this);
      this._removeIcon.style.display = "none";
    }
    else {
      // Make sure the icon is after the bodies.
      this.container.appendChild(this._removeIcon);
    }

    this._removeIcon.style.display = names.length > 1 ? "" : "none";
  }
};

/**
 * Handle a header DIV being clicked.
 * @param {Event} e
 */
pui.Accordion.prototype._headerOnClick = function(e) {
  var target = getTarget(e);
  var sectionNumber = null;
  while (sectionNumber == null && target != null) {
    sectionNumber = target.sectionNumber;
    target = target.parentNode;
  }
  if (sectionNumber != null) {
    if (this._expandedSection == sectionNumber) {
      sectionNumber = -1; // collapse
      if (this._allowCollapse && !this.designMode) {
        this.expandSection(sectionNumber);
      }
    }
    else {
      if (this.container["onsectionclickevent"] != null) {
        var returnVal = this.container["onsectionclickevent"](sectionNumber);
        if (returnVal == false) return;
      }
      this.expandSection(sectionNumber);
    }
  }
};

/**
 * Property setter for accordion-specific properties. Any not handled here are by Layout, including:
 * header them, body theme, color, font..., text align, ..., text transform.
 * @param {String} property
 * @param {String} value
 * @returns {Boolean}
 */
pui.Accordion.prototype.setProperty = function(property, value) {
  switch (property) {
    case "section names":
      var oldLen = this._sections.length;

      if (value == null || value == "") {
        value = this.INITIALLIST;
      }
      else if (pui.isBound(value) || pui.isTranslated(value)) {
        var tmplist = pui.parseCommaSeparatedList(value.designValue);
        if (tmplist.length == 0) value = this.INITIALLIST;
        else value = value.designValue; // Use the bound value saved in designer.
      }

      var names = pui.parseCommaSeparatedList(value);

      if (names.length != oldLen) {
        var cannotRemove = false;
        if (this.designMode) {
          // See if each section potentially being removed can be.
          for (var i = oldLen, n = names.length; i > n; i--) {
            if (this._cannotRemoveSection(i - 1)) {
              cannotRemove = true;
              break;
            }
          }
        }

        if (cannotRemove) {
          pui.alert(this.TXT_CANNOTREMOVE);
          // Rollback the change
          setTimeout(this.layout.updatePropertyInDesigner.bind(this.layout), 1, "section names", this._sections.join(","));
        }
        else {
          this._sections = names;
          this.render();

          var expandedSect = this._expandedSection; // Make sure only one section is expanded by calling expandSection.

          // If the selected section was removed, then show the new last section.
          if (expandedSect > names.length - 1) expandedSect = names.length - 1;

          this.expandSection(expandedSect);
        }
      }
      else {
        this._sections = names;
        this.render();
      }

      break;

    case "active section":
      if (!this.designMode) {
        if (value != null) {
          value = Number(value);
          if (!isNaN(value) && value != 0) {
            this.expandSection(value);
          }
        }
      }
      break;

    case "header theme":
      this.setHeaderSwatch(value);
      break;

    case "body theme":
      this.setBodySwatch(value);
      break;

    case "small sections":
      this.setMini(value == "true" || value == true);
      break;

    case "allow collapse":
      this.setAllowCollapse(value);
      break;

    case "straight edge":
      this.setStraightEdge(value);
      break;

    case "color":
    case "font style":
    case "font weight":
    case "text align":
    case "text decoration":
    case "text transform":
      this.setStyle(property, value);
      break;

    case "font family":
    case "font size":
      this.setStyle(property, value);
      this.resize();
      break;

    case "onsectionclick":
      if (!this.designMode) {
        this.container["onsectionclickevent"] = function() {
          eval("var section = arguments[0];");
          try {
            return eval(value);
          }
          catch (err) {
            pui.scriptError(err, "Onexpand Error:\n");
          }
        };
      }
      break;

    default:
      return false; // Let pui.Layout.prototype.setProperty handle other properties.
  }

  // Store template property values--any handled by this class.
  if (this.layout && this.layout.templateProps) {
    this.layout.templateProps[property] = value;
  }
  return true;
};

/**
 *
 * @param {String|Number} sectionNumber
 */
pui.Accordion.prototype.expandSection = function(sectionNumber) {
  this._expandedSection = parseInt(sectionNumber, 10);

  for (var i = 0; i < this._bodyDivs.length; i++) {
    var bodyDiv = this._bodyDivs[i];
    var headerButton = this._headerButtons[i];
    if (i === this._expandedSection) {
      headerButton.setIcon("minus");
      headerButton.setDisabled(!this._allowCollapse);
      bodyDiv.style.display = "";
      this.container.responseValue = sectionNumber;
    }
    else {
      headerButton.setIcon("plus");
      headerButton.setDisabled(false);
      bodyDiv.style.display = "none";
    }
  }

  this.setStraightEdge(this._straightEdge);
  this.resize(true); // Size this layout before sizing children.

  var layout = this.container.layout;
  if (layout != null && this._expandedSection >= 0 && this._expandedSection < this._bodyDivs.length) {
    // Render the items if they were not already. (Lazy Load)
    if (!this.designMode) layout.renderItems(this._expandedSection);

    // Make sure any child layouts and widgets in this section know they are visible now.
    if (layout.childrenSized[this._expandedSection] !== true) layout.sizeContainers(this._expandedSection);
  }
};

/**
 *
 * @param {Boolean|String} allow
 */
pui.Accordion.prototype.setAllowCollapse = function(allow) {
  this._allowCollapse = (allow == "true" || allow == true);
  this.expandSection(this._expandedSection);
};

/**
 *
 * @param {String|undefined} edge   e.g. all|left|right|top|bottom
 */
pui.Accordion.prototype.setStraightEdge = function(edge) {
  if (edge == null || pui.isBound(edge)) return;
  this._straightEdge = edge;
  var n = this._headerButtons.length;
  if (n <= 0) return;
  for (var i = 0; i < n; i++) {
    this._headerButtons[i].setStraightEdge("all");
    this._bodyPanels[i].setStraightEdge("all");
  }
  var topPart = this._headerButtons[0];
  var bottomPart = this._bodyPanels[n - 1];
  if (this._bodyDivs[n - 1].style.display == "none") {
    bottomPart = this._headerButtons[n - 1];
  }
  if (topPart == bottomPart) {
    topPart.setStraightEdge(edge);
    return;
  }

  switch (edge) {
    case "left":
      topPart.setStraightEdge("left");
      topPart.getMainSpan().style.borderBottomRightRadius = "0";
      topPart.getInnerSpan().style.borderBottomRightRadius = "0";
      bottomPart.setStraightEdge("left");
      bottomPart.getMainSpan().style.borderTopRightRadius = "0";
      bottomPart.getInnerSpan().style.borderTopRightRadius = "0";
      break;
    case "right":
      topPart.setStraightEdge("right");
      topPart.getMainSpan().style.borderBottomLeftRadius = "0";
      topPart.getInnerSpan().style.borderBottomLeftRadius = "0";
      bottomPart.setStraightEdge("right");
      bottomPart.getMainSpan().style.borderTopLeftRadius = "0";
      bottomPart.getInnerSpan().style.borderTopLeftRadius = "0";
      break;
    case "top":
      topPart.setStraightEdge("all");
      bottomPart.setStraightEdge("top");
      break;
    case "bottom":
      topPart.setStraightEdge("bottom");
      bottomPart.setStraightEdge("all");
      break;
    case "all":
      topPart.setStraightEdge("all");
      bottomPart.setStraightEdge("all");
      break;
    default:
      topPart.setStraightEdge("bottom");
      bottomPart.setStraightEdge("top");
      break;
  }
};

/**
 * @param {String} styleName
 * @param {String} styleValue
 */
pui.Accordion.prototype.setStyle = function(styleName, styleValue) {
  for (var i = 0; i < this._headerButtons.length; i++) {
    this._headerButtons[i].setStyle(styleName, styleValue);
  }
};

/**
 *
 * @param {type} properties
 */
pui.Accordion.prototype.setAllStyles = function(properties) {
  for (var i = 0; i < this._headerButtons.length; i++) {
    this._headerButtons[i].setAllStyles(properties);
  }
};

/**
 *
 * @param {type} mini
 */
pui.Accordion.prototype.setMini = function(mini) {
  for (var i = 0; i < this._headerButtons.length; i++) {
    this._headerButtons[i].setMini(mini);
  }
  this.resize();
};

/**
 *
 * @param {type} swatch
 */
pui.Accordion.prototype.setHeaderSwatch = function(swatch) {
  for (var i = 0; i < this._headerButtons.length; i++) {
    this._headerButtons[i].setSwatch(swatch);
  }
  this._headerSwatch = swatch;
};

/**
 *
 * @param {type} swatch
 */
pui.Accordion.prototype.setBodySwatch = function(swatch) {
  for (var i = 0; i < this._bodyPanels.length; i++) {
    this._bodyPanels[i].setSwatch(swatch);
  }
  this._bodySwatch = swatch;
};

/**
 *
 * @param {undefined|Boolean} skipSizeContainers    When true, expect the Layout object to resize child containers when appropriate.
 *                                                  True when called from Layout resize.
 */
pui.Accordion.prototype.resize = function(skipSizeContainers) {
  var totalHeight = this.container.offsetHeight;
  if (typeof this._pixelheight === "number") {
    // We are resizing as a result of setHeight being called, and the height was set at some pixel value. _pixelheight is not an
    // argument because resize may be called by parent classes, Layout, etc. that assume resize has the same params for all templates.
    totalHeight = this._pixelheight;
    delete this._pixelheight;
  }

  var buttonHeight = 0;
  if (this._headerDivs.length > 0) buttonHeight = this._headerDivs[0].offsetHeight;
  if (buttonHeight == 0) buttonHeight = 42; // default height

  var bodyHeight = totalHeight - buttonHeight * this._headerDivs.length;
  if (bodyHeight < 0) bodyHeight = 0;

  var bodyDiv = this._bodyDivs[this._expandedSection];
  if (bodyDiv != null) {
    bodyDiv.style.height = bodyHeight + "px";
  }
  if (this.container.layout != null && skipSizeContainers !== true) {
    this.container.layout.sizeContainers();
  }
};

/**
 * Set height and resize.
 * @param {String} newHeight
 */
pui.Accordion.prototype.setHeight = function(newHeight) {
  this.container.style.height = newHeight;

  // If the newHeight is some pixel value, then extract the value so that resize can use it instead of offsetHeight.
  delete this._pixelheight;
  if (typeof newHeight === "string" && newHeight.length >= 3 && newHeight.substring(newHeight.length - 2) === "px") {
    newHeight = parseInt(newHeight);
    if (!isNaN(newHeight)) {
      this._pixelheight = newHeight;
    }
  }

  this.resize();
};

//
// Private methods.
//

/**
 * Click handler for the Add or Remove section buttons in Designer.
 * @param {Event} e
 */
pui.Accordion.prototype._addrmvIconOnclick = function(e) {
  var target = e.target;
  var adding = target.adding === true;

  var itm = toolbar.designer.getDesignItemByDomObj(this.container);
  var propValue = itm.properties["section names"];
  if (pui.isTranslated(propValue)) {
    // Number of sections is controlled by this, doesn't make sense to change.
    return;
  }
  else if (pui.isBound(propValue)) {
    var designValue = propValue.designValue;
    if (designValue == null || designValue == "") designValue = this.INITIALLIST;
    designValue = pui.parseCommaSeparatedList(designValue);

    if (adding) designValue.push("Section " + (designValue.length + 1));
    else designValue.pop();

    propValue.designValue = designValue.join(",");
  }
  else {
    if (propValue == "" || propValue == null) propValue = this.INITIALLIST;
    propValue = pui.parseCommaSeparatedList(propValue);

    if (adding) propValue.push("Section " + (propValue.length + 1));
    else propValue.pop();

    propValue = propValue.join(",");
  }

  var nmodel = this.container.propertiesNamedModel;
  var propConfig = nmodel["section names"];
  itm.designer.undo.start("Add/Remove Section");
  itm.designer.undo.add(itm, propConfig.name);
  applyPropertyToField(propConfig, itm.properties, itm.dom, propValue, true, itm, null);
  itm.propertiesChanged["section names"] = true;
  itm.changed = true;
  itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
  itm.designer.selection.clear();
  itm.designer.selection.add(itm);
  itm.designer.propWindow.refresh();
};

/**
 * Returns true if widgets are inside the specified section; else false.
 * @param {Number} sectNum   The section number we're checking for removal.
 * @returns {Boolean}  Returns true if any of the body DIVs have children; else false.
 * @private
 */
pui.Accordion.prototype._cannotRemoveSection = function(sectNum) {
  var bodyDiv = this._bodyDivs[sectNum];
  var el = bodyDiv.querySelector("div[container=true]");

  return el && el.children && el.children.length > 0;
};

/**
 * Needed by pui.Layout to let Designer best-guess the container to drop something in.
 * Overrides pui.layout.Template.getVisibleContainerIndex
 * @returns {Number}
 */
pui.Accordion.prototype.getVisibleContainerIndex = function() {
  return parseInt(this._expandedSection, 10);
};
