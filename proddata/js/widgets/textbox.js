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
 * TextBox widget class.
 * This is a class now because managing memory leaks is easier with a class.
 * @constructor
 */
pui.TextBoxWidget = function(parms) {
  this.dom = parms.dom;
  this.dom.value = parms.evalProperty("value");
  this.design = parms.design;

  if (!this.design) {
    pui.applyAutoComp(parms.properties, parms.originalValue, this.dom);

    if (pui.iPadEmulation && !pui.iPhoneEmulation && this.dom.id.indexOf(".") == -1) {
      this.dom.addEventListener("focus", this);
      this.dom.addEventListener("blur", this);
    }

    // Retain default browser behavior unless the user sets this...
    if (typeof pui["allow spellcheck"] == "boolean") {
      this.dom.spellcheck = pui["allow spellcheck"];
    }

    // In case they are changing a date field to a textbox, remove the calendar
    if (this.dom.calimg) pui.removeCal(this.dom);

    // Default off if not set by 'html auto complete' property.
    if (this.dom.getAttribute("autocomplete") == null && (context != "genie" || !pui.genie.config.browserAutoComplete)) {
      this.dom.setAttribute("autocomplete", "off");
      if (context == "dspf") {
        this.dom.setAttribute("name", pui.randomTextBoxName());
      }
    }
  }

  var promptIcon = parms.evalProperty("prompt icon");

  if (this.design) {
    this.dom.readOnly = true;
    this.dom.spellcheck = false;

    var itm = parms.designItem;
    this.designItem = itm;
    itm.promptIcon = null;
    if (promptIcon) {
      itm.promptIcon = promptIcon;
    }
    this.dom.sizeMe = this._sizeMeDesign;
  }
  else {
    if (promptIcon) {
      this.dom.sizeMe = this._sizeMe;
    }
  }

  this.dom.alwaysSizeMe = true; // Don't just do sizeMe when dimensions are percents and in layouts.

  if (promptIcon && !this.design) {
    this.addPrompt(parms);
  }

  // PUI-425: Add an event listener to focus the input content when click.
  // PJS-1070: Add !inDesignMode() in the condition to ensure that this block only executes at runtime.
  if (context == "dspf" && !inDesignMode()) {
    this.dom.addEventListener("click", this);
  }

  this.dom.destroy = this._destroy.bind(this);
  this.dom.puiTrackEvent = pui.trackEvent;
};

pui.TextBoxWidget.prototype = Object.create(pui.BaseClass.prototype); // Inherit deleteOwnProperties.

/**
 * When the prompt icon is present, ensure that the prompt icon moves with the DOM element.
 * Note: _sizeMe is assigned to the dom element, so "this" is the dom element.
 */
pui.TextBoxWidget.prototype._sizeMe = function() {
  var dom = this;
  pui.movePrompter(dom);
};

/**
 * Ensure that the prompt icon is rendered in grid cells and moves with the DOM element.
 * Note: _sizeMeDesign is assigned to the dom element, so "this" is the dom element.
 */
pui.TextBoxWidget.prototype._sizeMeDesign = function() {
  var dom = this;
  var itm = dom.designItem;
  if (itm) {
    itm.drawIcon();
    itm.mirrorDown();
  }
};

/**
 * Cleanup event listeners to prevent memory leaks.
 * Some internal code will look for and call a "destroy" function; e.g. grid.
 */
pui.TextBoxWidget.prototype._destroy = function() {
  var dom = this.dom;

  // Help reduce memory use in case the dom element is not collected.
  dom.removeAttribute("autocomplete");
  dom.removeAttribute("name");
  dom.removeAttribute("type");
  dom.style = "";

  var prompter = dom.prompter;
  if (prompter) {
    if (prompter.parentNode) {
      prompter.parentNode.removeChild(prompter);
    }
    pui.clearChildNodes(prompter);
    pui.clearNode(prompter);
  }

  if (Array.isArray(dom.extraDomEls)) {
    while (dom.extraDomEls.length > 0) {
      var el = dom.extraDomEls.pop();
      if (el) {
        if (el.parentNode) el.parentNode.removeChild(el);
        pui.clearChildNodes(el);
        pui.clearNode(el);
      }
    }
  }

  pui.removeEvents(dom); // Remove events added in render.js, properties.js.
  dom.removeEventListener("click", this);
  dom.removeEventListener("focus", this);
  dom.removeEventListener("blur", this);

  if (dom.autoComp && typeof dom.autoComp.destroy === "function") {
    dom.autoComp.destroy();
  }

  pui.clearChildNodes(dom);
  pui.clearNode(dom);
  dom = null;

  this.deleteOwnProperties();
};

/**
 * Simplify event handling and cleanup.
 * @param {Event} e
 */
pui.TextBoxWidget.prototype["handleEvent"] = function(e) {
  switch (e.type) {
    case "click":
      if (pui["highlight on focus"]) {
        e.target.focus();
        e.target.select();
      }
      break;

    case "focus":
      getObj("ipadKeyboard").style.display = "";
      break;

    case "blur":
      getObj("ipadKeyboard").style.display = "none";
      break;
  }
};

/**
 * Global property setter.
 * (Potentially, if widgets handled all properties, the properties.js propertySetters could be simplified.)
 * @param {Object} parms
 */
pui.TextBoxWidget.prototype.setProperty = function(parms) {
  switch (parms.propertyName) {
    case "field type":
      if (parms.oldDom && parms.oldDom.floatingPlaceholder != null && parms.dom && parms.dom.floatingPlaceholder == null) {
        pui.floatPlaceholder(parms.dom);
      }
      break;
  }

  if (parms.dom && parms.dom.floatingPlaceholder != null) {
    pui.movePropertiesFromFloatingPlaceholderDiv(parms);
  }
};

/**
 *
 * @param {Object} parms
 */
pui.TextBoxWidget.prototype.addPrompt = function(parms) {
  var icon;
  var prompter = document.createElement("div");
  var promptIcon = parms.evalProperty("prompt icon");
  prompter.classList.add("pui-prompt");
  for (var i = 0; i < parms.dom.classList.length; i++) {
    prompter.classList.add("pui-prompt-" + parms.dom.classList[i]);
  }
  if (promptIcon.substr(0, 9) === "material:") {
    icon = promptIcon.substr(9);
    prompter.innerText = trim(icon);
    prompter.classList.add("pui-material-icons");
  }
  else if (promptIcon.substr(0, 12) === "fontAwesome:") {
    icon = trim(promptIcon.substr(12));
    prompter.classList.add("pui-fa-icons fa-" + icon);
    prompter.innerText = "";
  }
  else {
    var iconSets = pui.getDefaultIconSets();
    if (pui["customIconList"] && pui["customIconList"]) {
      if (Array.isArray(pui["customIconList"]["icons"]) && pui["customIconList"]["icons"].length) {
        iconSets = pui["customIconList"]["icons"];
      }
    }
    var iconValueArr = promptIcon.split(":");
    var iconValueType = iconValueArr.shift().split("-");
    var iconValueClassList = iconValueType.pop();
    iconValueType = iconValueType.join("-");
    var iconVal = iconValueArr.pop();
    iconSets.every(function(iconSet) {
      var type = iconSet["type"];
      var iconClassName = iconSet["classList"][iconValueClassList];
      if (iconValueType === type) {
        var classes = (iconClassName + iconVal).split(" ");
        for (var i = 0; i < classes.length; i++) {
          prompter.classList.add(classes[i]);
        }
        pui.clearChildNodes(prompter);
        pui.clearNode(prompter);

        return false;
      }
      return true;
    });
  }

  prompter.owner = parms.dom; // Point back to the input field to avoid using a closure, which prevents garbage collection. PJS-1110.
  prompter.onclick = this.promptOnClick;

  parms.dom.parentNode.appendChild(prompter);
  parms.dom.prompter = prompter;
  parms.dom.extraDomEls = [prompter];

  pui.movePrompter(parms.dom);
};

/**
 * When the prompt icon is clicked, call a custom defined function and pass the value.
 * "this" is the prompter Element.
 */
pui.TextBoxWidget.prototype.promptOnClick = function() {
  var dom = this.owner;
  var onprompt = dom["onprompt"];
  if (typeof onprompt === "function") {
    onprompt(dom.value);
  }
};

pui.widgets.add({
  name: "textbox",
  tag: "input",
  newId: "TextBox",
  defaults: {
    "css class": "input"
  },
  pickIcon1IsDiv: true,
  icon1Class: "pui-prompt",

  propertySetters: {

    "field type": function(parms) {
      if (parms.dom.textboxWidget != null) {
        parms.dom.destroy();
      }

      parms.dom.textboxWidget = new pui.TextBoxWidget(parms);
    },

    "value": function(parms) {
      if (parms.dom.autoCompTranslated) {
        parms.dom.autoCompTranslated = false;
      }
      else {
        parms.dom.value = parms.value;
      }
    },

    "input type": function(parms) {
      if (!parms.design) {
        try {
          parms.dom.setAttribute("type", parms.value);
        }
        catch (e) { }
      }
    },

    "browser auto complete": function(parms) {
      if (!parms.design) {
        parms.dom.setAttribute("autocomplete", parms.value);
        if (context == "dspf") {
          if (parms.value == "off") {
            parms.dom.setAttribute("name", pui.randomTextBoxName());
          }
          else {
            parms.dom.removeAttribute("name");
          }
        }
      }
    },

    "choices url": function(parms) {
      if (!parms.design && parms.dom && parms.dom.autoComp && typeof parms.dom.autoComp.updateUrl === "function") {
        parms.dom.autoComp.updateUrl(parms.value);
      }
    },

    "prompt icon": function(parms) {
      var promptIcon = parms.value;
      if (parms.design) {
        var itm = parms.designItem;
        itm.promptIcon = null;
        if (promptIcon) itm.promptIcon = promptIcon;
        itm.drawIcon();
        itm.mirrorDown();
      }
    },

    "visibility": function(parms) {
      if (parms.dom.prompter) {
        if (parms.value === "hidden") {
          parms.dom.prompter.style.visibility = "hidden";
        }
        else {
          parms.dom.prompter.style.visibility = "";
        }
      }
    },

    "css class": function(parms) {
      if (parms.design) {
        parms.designItem.drawIcon();
      }
    }

  },

  globalAfterSetter: function(parms) {
    if (parms.dom && parms.dom.textboxWidget && typeof parms.dom.textboxWidget.setProperty === "function") {
      parms.dom.textboxWidget.setProperty(parms);
    }
  }

});

/**
 * Position the prompt icon.
 * Note: movePrompter is also called by pui.floatPlaceholder in runtime/utils.js.
 * @param {Element} inputDom
 */
pui.movePrompter = function(inputDom) {
  var prompter = inputDom.prompter;
  if (!prompter) return;
  if (inputDom.parentNode && inputDom.parentNode.floatingPlaceholder) inputDom = inputDom.parentNode;
  var left = inputDom.style.left;
  if (left != null && typeof left == "string" && left.length >= 3 && left.substr(left.length - 2, 2) == "px") left = parseInt(left);
  else left = inputDom.offsetLeft;
  if (isNaN(left)) left = 0;
  var top;
  top = inputDom.style.top;
  if (top != null && typeof top == "string" && top.length >= 3 && top.substr(top.length - 2, 2) == "px") top = parseInt(top);
  else top = inputDom.offsetTop;
  if (isNaN(top)) top = 0;
  prompter.style.left = left + inputDom.offsetWidth + 6 + "px";
  top += parseInt((inputDom.offsetHeight - 18) / 2);
  top -= 4;
  if (pui["is_quirksmode"]) top -= 1;
  prompter.style.top = top + "px";
  prompter.style.zIndex = inputDom.style.zIndex;
  prompter.style.visibility = inputDom.style.visibility;
  prompter.style.filter = inputDom.style.filter;
  prompter.style.opacity = inputDom.style.opacity;
};
