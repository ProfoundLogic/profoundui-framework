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

pui.widgets.tabStyles = {
  "Simple": {
    useImages: false,
    height: 15,
    defaultBackColor: "#eeeeff",
    hiColor: "#666699"
  },
  "Classic": {
    useImages: true,
    hiImages: true,
    height: 19,
    leftWidth: 5,
    rightWidth: 5,
    defaultBackColor: "#fcfcfe"
  },
  "Glass": {
    useImages: true,
    hiImages: true,
    height: 21,
    leftWidth: 3,
    rightWidth: 3,
    defaultBackColor: "#deecfd",
    hiColor: "#15428b",
    selColor: "#15428b",
    borderColor: "#8db2e3",
    leftMargin: 3
  },
  "Angle": {
    useImages: true,
    hiImages: false,
    height: 21,
    leftWidth: 9,
    rightWidth: 25,
    defaultBackColor: "#ffffff",
    hiColor: "#ffffff",
    selColor: "#013572",
    hiUnderline: true,
    selBold: true,
    separated: true,
    borderColor: "#5977b3"
  },
  "Glow": {
    useImages: true,
    hiImages: false,
    height: 19,
    leftWidth: 7,
    rightWidth: 7,
    defaultBackColor: "#ffffff",
    hiColor: "#666699"
  },
  "Smooth": {
    useImages: true,
    hiImages: true,
    height: 25,
    leftWidth: 6,
    rightWidth: 6,
    defaultBackColor: "#f8f2e4",
    backBar: true
  },
  "Delicate": {
    useImages: true,
    hiImages: false,
    height: 27,
    leftWidth: 2,
    rightWidth: 2,
    defaultBackColor: "#ffffff",
    hiColor: "#999999",
    borderColor: "#dedede",
    leftMargin: 0
  },
  "Concrete": {
    useImages: true,
    hiImages: false,
    height: 23,
    leftWidth: 5,
    rightWidth: 5,
    defaultBackColor: "#ffffff",
    hiColor: "#666699",
    selColor: "#ffffff",
    separated: true,
    leftMargin: 2
  },
  "Sky": {
    useImages: true,
    hiImages: true,
    height: 22,
    leftWidth: 4,
    rightWidth: 4,
    defaultBackColor: "#ffffff",
    hiColor: "#627ec1",
    selColor: "#627ec1",
    separated: true,
    backBar: true,
    backBarColor: "#f4f7fb",
    borderColor: "#bcd2e6",
    borderSize: 2
  },
  "Block": {
    useImages: true,
    hiImages: true,
    height: 23,
    leftWidth: 4,
    rightWidth: 4,
    defaultBackColor: "#87c2f2",
    hiColor: "#ffffff",
    selColor: "#ffffff",
    borderColor: "#2763a5",
    separated: true
  },
  "CSS": {
    useImages: false,
    useDefaultStyles: false
  }
};

pui.widgets.preloadTabStyle = function(tabStyle) {
  var tabStyleSettings = pui.widgets.tabStyles[tabStyle];
  if (tabStyleSettings != null) {
    if (tabStyleSettings.preloaded != true) { // not already preloaded
      if (tabStyleSettings.useImages) {
        var extension = tabStyleSettings["imageFileExtension"];
        if (extension == null) extension = "gif";
        if (extension.substr(0, 1) == ".") extension = extension.substr(1);
        function preload(imageSrc) {
          var image = new Image();
          image.src = imageSrc;
        }
        var path = pui.normalizeURL("/profoundui/proddata/images/tabs/" + tabStyle.toLowerCase() + "/");
        if (tabStyleSettings.hiImages) {
          preload(path + "left-hi." + extension);
          preload(path + "middle-hi." + extension);
          preload(path + "right-hi." + extension);
        }
        preload(path + "left-sel." + extension);
        preload(path + "middle-sel." + extension);
        preload(path + "right-sel." + extension);
      }
      tabStyleSettings.preloaded = true;
    }
  }
};

/**
 * Tab Panel Class
 * Note: widgets/layout/pui.TabLayout adopts public properties and methods from this object via TabPanel.call.
 * (TabPanel properties should not be moved into a prototype; doing so would break TabLayout, which adopts TabPanel properties.)
 * @constructor
 */
function TabPanel() {
  // Public Properties
  this.INITIALLIST = "Tab 1,Tab 2,Tab 3";
  this.TXT_CANNOTREMOVE = "The tab cannot be removed because it contains other elements that must be removed first.";

  // Private Properties
  var me = this;

  // The number of pixels to scroll when first clicking scroll right/left.
  var beginScrollIncrement = Number(pui["tabpanel scroll speed"]);
  if (isNaN(beginScrollIncrement) || beginScrollIncrement < 1) beginScrollIncrement = 5;

  var scrollAccelAmount = Number(pui["tabpanel scroll acceleration"]);
  if (isNaN(scrollAccelAmount) || scrollAccelAmount < 0) scrollAccelAmount = 1;

  // These are set and cleared in onmouseup and onmousedown of the scroll buttons.
  var scrollLeftIval = null;
  var scrollRightIval = null;

  var leftScrollSpan = null; // These are set when scroll buttons are added.
  var rightScrollSpan = null;

  // These allow scrolling speed to increase the longer the button is held.
  var curScrollIncrement = 5;
  var scrollCounter = 0;

  // Clicking a tab redraws the panel, so preserve the scrollLeft with this.
  this._lastScrollLeft = 0;
  this._needScrollToActive = true;

  // This value is used in 3 places for themes that don't use images.
  var simpleSelectedTabBackgroundColor = "#B7C8F6";

  // This is used to hide tabs dynamically. The key is the original, unmoved index of the tab. The value is true if hidden, false otherwise.
  this._hiddenTabs = {};

  // Tab style information when tab panel styles are hard-coded.
  var settings; // The settings for the set tab style.
  var path; // path to images for the style.
  var extension; // File extension for images in the style.
  var borderColor; // CSS borderColor for the tabs.

  this._preValidationSelectedTab = 0;

  // Public Properties
  this.defaults = {};
  this.defaults.fontFamily = "arial";
  this.defaults.fontSize = "12px";
  this.defaults.color = "#333366";

  this.tabs = []; // Array of strings: tab names.
  this.selectedTab = 0;
  this.container = null;
  this.backColor = "#eeeeff";

  this.tabStyle = "Simple";

  this._headerArea = null; // Holds all the tabs. Needs to be in class for add/removeIconOnClick.

  // Public Methods

  /**
   * Hide a tab if that tab was not active or if sendTabResponse was false. If that tab was active, and sendTabResponse is false,
   * then select a different tab.
   * @param {Number} tabId
   */
  this.hideTab = function(tabId) {
    var redraw = false;
    if (this.selectedTab == tabId) {
      if (!this.sendTabResponse) {
        // Find the first non-hidden tab and select it.
        var newSelectedTab = -1;
        for (var i = 0, n = this.tabs.length; i < n; i++) {
          if (i != tabId && this._hiddenTabs[i] !== true) {
            newSelectedTab = i;
            break;
          }
        }

        if (newSelectedTab != -1) {
          this.selectedTab = newSelectedTab;
          this._hiddenTabs[tabId] = true;
          redraw = true;
        }
      }
    }
    else {
      this._hiddenTabs[tabId] = true;
      redraw = true;
    }

    if (redraw) this.drawChanged();
  };

  /**
   * Un-hide a tab and re-draw the tabs and contents.
   * @param {Number} tabId
   */
  this.showTab = function(tabId) {
    me._hiddenTabs[tabId] = false;
    me.drawChanged();
  };

  // API Methods attached as container element's properties of the same name.

  /**
   * API. Change to the specified tab. This method should be attached as the container DOM element's setTab method.
   * See "setTab( tabPanelid, tab )" (https://docs.profoundlogic.com/x/FwAy).
   * @param {Number} tabId
   */
  this.setTab = function(tabId) {
    if (me.selectedTab != tabId) {
      me.selectedTab = tabId;

      if (me._hiddenTabs[tabId]) me._hiddenTabs[tabId] = false; // Unhide the tab when being set.

      me.processTabChange(tabId);
    }
  };

  this.getTab = function() {
    return me.selectedTab;
  };

  this.refresh = function() {
    me.setTab(me.selectedTab);
  };

  // Other public methods.

  this.setDefaultBackColor = function() {
    var settings = pui.widgets.tabStyles[me.tabStyle];
    if (settings != null && settings.defaultBackColor != null) {
      me.backColor = settings.defaultBackColor;
    }
  };

  /**
   * Handle selectedTab change. Show elements for this tab, hide elements in non-active tabs. (Overridden)
   * Pre-Conditions: me.selectedTab is the active tab.
   * @returns {undefined}
   */
  this.drawChanged = function() {
    me.draw(); // Just re-draw everything.
  };

  /**
   * Clears the container and draws new elements for each tab, the content-area, the scroll
   * buttons, and the -/+ buttons (in design mode). Called when the widget is resized,
   * when any property is applied, or a new tab is selected.
   * (Overridden in TabLayout subclass.)
   * @returns {undefined}
   */
  this.draw = function() {
    var outerSpan;
    // Load tab style settings.
    if (me.tabStyle == null || me.tabStyle == "") me.tabStyle = "Simple";

    settings = pui.widgets.tabStyles[me.tabStyle];
    if (settings == null) settings = pui.widgets.tabStyles["Simple"]; // a custom widget may not be installed on current system

    path = pui.normalizeURL("/profoundui/proddata/images/tabs/" + me.tabStyle.toLowerCase() + "/");
    extension = settings["imageFileExtension"];
    if (extension == null) extension = "gif";
    if (extension.substr(0, 1) == ".") extension = extension.substr(1);

    borderColor = "#aaaaaa";
    if (settings.borderColor != null) borderColor = settings.borderColor;
    // done loading settings.

    me.container.innerHTML = "";
    me.container.style.backgroundColor = "";

    if (settings.useDefaultStyles !== false) {
      if (!me.container.style.fontFamily) me.container.style.fontFamily = me.defaults.fontFamily;
      if (!me.container.style.fontSize) me.container.style.fontSize = me.defaults.fontSize;
      if (!me.container.style.color) me.container.style.color = me.defaults.color;
    }

    var adjust = 7;
    if (settings.useImages) adjust = 1;

    me._headerArea = document.createElement("div");
    me._headerArea.className = "header-area";
    me._headerArea.style.position = "absolute";
    me._headerArea.style.left = "0px";
    me._headerArea.style.top = "0px";
    me._headerArea.style.height = (settings.height + adjust + 1) + "px";
    me._headerArea.style.padding = "0px";
    me._headerArea.style.whiteSpace = "nowrap";
    me._headerArea.style.overflow = "hidden";

    if (settings.backBar) {
      me.container.style.overflowX = "hidden";
      me.container.style.overflowY = "hidden";
      if (settings.backBarColor != null) {
        me._headerArea.style.backgroundColor = settings.backBarColor;
      }
      else {
        me._headerArea.style.backgroundImage = "url(" + path + "middle." + extension + ")";
        me._headerArea.style.backgroundRepeat = "repeat-x";
      }
    }
    me._headerArea.style.width = "100%";

    var bottomDiv = document.createElement("div");
    bottomDiv.style.position = "absolute";
    bottomDiv.style.left = "0px";
    bottomDiv.style.top = (settings.height + adjust) + "px";
    bottomDiv.className = "content-area";

    var sWidth = me.container.style.width;
    var cntWidth = 0;
    if (typeof sWidth == "string" && sWidth != "" && !isNaN(sWidth)) sWidth += "px";
    if (sWidth != null && sWidth != "" && sWidth.length >= 3 && sWidth.substr(sWidth.length - 2) == "px") {
      cntWidth = parseInt(sWidth);
      if (isNaN(cntWidth)) cntWidth = 0;
      cntWidth += 2;
    }
    else {
      cntWidth = me.container.offsetWidth;
    }

    var sHeight = me.container.style.height;
    if (typeof sHeight == "string" && sHeight != "" && !isNaN(sHeight)) sHeight += "px";
    var cntHeight = 0;
    if (sHeight != null && sHeight != "" && sHeight.length >= 3 && sHeight.substr(sHeight.length - 2) == "px") {
      cntHeight = parseInt(sHeight);
      if (isNaN(cntHeight)) cntHeight = 0;
      cntHeight += 2;
    }
    else {
      cntHeight = me.container.offsetHeight;
    }

    bottomDiv.style.height = Math.abs(cntHeight - settings.height - adjust - 4) + "px";
    bottomDiv.style.width = Math.abs(cntWidth - 4) + "px";

    var borderSize = 1;
    if (settings.borderSize) borderSize = settings.borderSize;
    bottomDiv.style.border = borderSize + "px solid " + borderColor;
    bottomDiv.style.backgroundColor = me.backColor;

    for (var i = 0; i < me.tabs.length; i++) {
      // Create a parent span to encapsulate the tab text, left, and right border.
      outerSpan = document.createElement("span");
      outerSpan.style.display = "inline-block";
      if (this._hiddenTabs[i]) outerSpan.style.display = "none";

      if (i == me.selectedTab) {
        if (me.container.className != "") {
          outerSpan.className = me.container.className.split(" ")[0] + "-";
        }
        outerSpan.className += "selected-tab";
      }
      if (settings.leftWidth != null) {
        var leftSpan = document.createElement("span");
        leftSpan.style.backgroundImage = "url(" + path + "left" + (i == me.selectedTab ? "-sel" : "") + "." + extension + ")";
        leftSpan.style.backgroundRepeat = "no-repeat";
        leftSpan.style.height = (settings.height + 2) + "px";
        leftSpan.style.width = settings.leftWidth + "px";
        leftSpan.style.cssFloat = "left"; // Firefox
        leftSpan.style.styleFloat = "left"; // IE
        leftSpan.style.display = "inline-block";
      }
      if (settings.rightWidth != null) {
        var rightSpan = document.createElement("span");
        rightSpan.style.backgroundImage = "url(" + path + "right" + (i == me.selectedTab ? "-sel" : "") + "." + extension + ")";
        rightSpan.style.backgroundRepeat = "no-repeat";
        rightSpan.style.height = (settings.height + 2) + "px";
        rightSpan.style.width = settings.rightWidth + "px";
        rightSpan.style.cssFloat = "left"; // Forefox
        rightSpan.style.styleFloat = "left"; // IE
        rightSpan.style.display = "inline-block";
      }

      var tabSpan = document.createElement("span");
      tabSpan.tabId = i;
      tabSpan.innerHTML = me.tabs[i];
      tabSpan.style.display = "block";
      tabSpan.style.cssFloat = "left"; // Forefox
      tabSpan.style.styleFloat = "left"; // IE
      tabSpan.style.height = settings.height + "px";
      tabSpan.style.lineHeight = settings.height + "px";
      tabSpan.setAttribute("isTab", "true");
      tabSpan.style.display = "inline-block";

      if (settings.useImages) {
        tabSpan.style.backgroundImage = "url(" + path + "middle" + (i == me.selectedTab ? "-sel" : "") + "." + extension + ")";
        tabSpan.style.backgroundRepeat = "repeat-x";
        var leftMargin = 1;
        if (settings.leftMargin) leftMargin = settings.leftMargin;
        leftSpan.style.marginLeft = leftMargin + "px";
        leftSpan.style.paddingTop = "2px";
        tabSpan.style.padding = "2px 0.5em";
        rightSpan.style.paddingTop = "2px";
        if (i != me.selectedTab) {
          tabSpan.style.cursor = "pointer";
        }
        else {
          if (settings.separated != true) {
            leftSpan.style.backgroundColor = me.backColor;
            rightSpan.style.backgroundColor = me.backColor;
            tabSpan.style.backgroundColor = me.backColor;

            // Some tab styles have noticeable corners caused by a background color being set - 5974
            if ((this.tabStyle == "Glass" || this.tabStyle == "Delicate" || this.tabStyle == "Classic") && i == me.selectedTab) {
              leftSpan.style.backgroundSize = "cover";
              rightSpan.style.backgroundSize = "cover";
              leftSpan.style.backgroundColor = "";
              rightSpan.style.backgroundColor = "";
            }
          }
          tabSpan.style.cursor = "default";
          if (settings.selColor != null) tabSpan.style.color = settings.selColor;
          if (settings.selBold == true) tabSpan.style.fontWeight = "bold";
        }
      }
      else {
        tabSpan.style.marginLeft = "3px";
        tabSpan.style.padding = "3px 0.5em";
        tabSpan.style.borderTop = "1px solid " + borderColor;
        tabSpan.style.borderLeft = "1px solid " + borderColor;
        tabSpan.style.borderRight = "1px solid " + borderColor;
        if (i != me.selectedTab) {
          tabSpan.style.borderBottom = "1px solid " + borderColor;
          if (settings["defaultTabColor"]) tabSpan.style.backgroundColor = settings["defaultTabColor"];
          else tabSpan.style.backgroundColor = simpleSelectedTabBackgroundColor;
          if (context == "genie") {
            tabSpan.style.filter = "progid:DXImageTransform.Microsoft.Gradient(gradientType=0,startColorStr=white,endColorStr=#" + simpleSelectedTabBackgroundColor + ")";
          }
          tabSpan.style.cursor = "pointer";
        }
        else {
          tabSpan.style.backgroundColor = me.backColor;
          tabSpan.style.borderBottom = "1px solid " + me.backColor;
          tabSpan.style.cursor = "default";
        }
      }

      tabSpan.onmouseover = me.tabSpanOnmouseover;
      tabSpan.onmouseout = me.tabSpanOnmouseout;
      // This method could be called from Genie in Design mode, so it must always be attached.
      tabSpan.ondblclick = me.tabSpanOndblclick;
      tabSpan.onclick = me.tabSpanOnclick;
      // Add the tab container span to the widget. Add the left border if it
      // exists, add the tab itself, and add the right border if it exists.
      me._headerArea.appendChild(outerSpan);
      if (settings.leftWidth != null) outerSpan.appendChild(leftSpan);
      outerSpan.appendChild(tabSpan);
      if (settings.rightWidth != null) outerSpan.appendChild(rightSpan);
    }
    // done iterating over each tab.
    me.container.appendChild(bottomDiv);
    me.container.appendChild(me._headerArea);

    leftScrollSpan = null;
    rightScrollSpan = null;
    // Do the tabs need scroll buttons. scrollWidth > offsetWidth on overflow.
    if (me._headerArea.scrollWidth - me._headerArea.offsetWidth > 0) {
      me.addScrollButtons(me._headerArea);

      // Scroll to the selected tab if "active tab" is bound. When "active tab" is bound, then
      // the tabpanel is re-constructed each ExFmt; so lastScrollLeft would be null at first.
      if (this.sendActiveTab && this._needScrollToActive) {
        // The selected tab number should correspond to the array index of childNodes.
        if (me._headerArea.childNodes != null && me.selectedTab >= 0 && me.selectedTab < me._headerArea.childNodes.length) {
          outerSpan = me._headerArea.childNodes[me.selectedTab];
          // Put the selected tab in the middle of the tab panel.
          me._lastScrollLeft = Math.round(outerSpan.offsetLeft - me._headerArea.offsetWidth / 2 + outerSpan.offsetWidth / 2);
        }
        this._needScrollToActive = false;
      }
      me._checkScrollButtons();
    }

    var isDesign = inDesignMode();

    if (isDesign) {
      me.createAddRemoveIcons();
    }

    processElements("div");
    processElements("input");
    processElements("select");
    processElements("textarea");
    processElements("button");
    processElements("img");

    // Get all elements in the page with the specified tag. Check if they belong in this tab panel.
    // If they belong, show the ones in the active tab and hide the others.
    function processElements(tag) {
      var container;
      if (context == "dspf" && !isDesign) {
        container = pui.runtimeContainer;
      }
      else {
        container = document.getElementById(appContainerId);
      }
      var elems = container.getElementsByTagName(tag);
      for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (elem.parentTabPanel != null && elem.parentTab != null && elem.parentTabPanel == me.container.id) {
          if (elem.parentTab == me.selectedTab) {
            elem.style.visibility = "";
            applyProperty(elem, "visibility", "");
            if (elem.grid && elem.grid.setProperty) {
              if (elem.grid.hasHeader || !elem.grid.subfileHidden) elem.grid["show"]();
              else elem.grid["hide"]();
            }
            // Render charts if not done already. A chart will not render when
            // the containing tab is inactive...
            if (!inDesignMode() && elem.pui.properties["field type"] == "chart" && !elem.chart) {
              applyProperty(elem, "field type", "chart");
            }
          }
          else {
            elem.style.visibility = "hidden";
            applyProperty(elem, "visibility", "hidden");
            if (elem.grid && elem.grid.setProperty) elem.grid["hide"]();
            if (elem.validationTip != null) {
              elem.validationTip.hide();
            }
          }
          if (isDesign && elem.tagName == "INPUT" && (elem.type == "text" || pui.isHTML5InputType(elem.type) || elem.type == "checkbox" || elem.type == "radio")) {
            toolbar.designer.getDesignItemByDomObj(elem).drawIcon();
          }
        }
      }
    }
  }; // end this.draw().

  /**
   * Add +/- icons in top right of widget. Should be in design mode.
   * (Also called by TabLayout subclass.)
   * @returns {undefined}
   */
  this.createAddRemoveIcons = function() {
    var addIcon = designUtils.createAndAppendIcon("plus", "Add New Tab", me.container);
    var removeIcon = designUtils.createAndAppendIcon("minus", "Remove Tab", me.container);
    addIcon.style.right = "2px";
    removeIcon.style.right = "16px";
    removeIcon.style.top = addIcon.style.top = "2px";
    addIcon.onclick = me.addIconOnclick;
    removeIcon.onclick = me.removeIconOnclick;
  };

  /**
   * The user changed the tab by clicking on one that isn't the selectedTab
   * or by calling the API method, setTab, on a tab that isn't selectedTab.
   * A response value will be set if "tab response" is bound.
   * @param {Number} tab
   * @returns {undefined}
   */
  this.processTabChange = function(tab) {
    var dom = me.container;
    if (dom.disabled != true) {
      if (context == "dspf" && me.sendTabResponse == true) {
        dom.responseValue = tab;
        if (dom.bypassValidation == "true" || dom.bypassValidation == "send data") {
          pui.bypassValidation = dom.bypassValidation;
        }
        if (me.responseAID) {
          pui.keyName = me.responseAID;
        }
        var returnVal = pui.respond();
        if (returnVal == false) {
          dom.responseValue = null; // Validation failed; send no response.
          me.selectedTab = me._preValidationSelectedTab; // Prevent selectedTab from being out of sync.
        }
      }
      else {
        me.drawChanged();
        if (context == "dspf" && me.sendActiveTab == true) {
          dom.responseValue = tab;
        }
      }
    }
  };

  /**
   * Restyle a tab using the settings when the mouse is over the tab.
   * @param {MouseEvent} e
   * @returns {undefined}
   */
  this.tabSpanOnmouseover = function(e) {
    var obj = getTarget(e);
    if (obj.tabId == null && obj.parentNode.tabId != null) obj = obj.parentNode;
    if (obj.tabId == me.selectedTab) return;
    if (settings.useImages && settings.hiImages) {
      obj.style.backgroundImage = "url(" + path + "middle-hi." + extension + ")";
      obj.previousSibling.style.backgroundImage = "url(" + path + "left-hi." + extension + ")";
      obj.nextSibling.style.backgroundImage = "url(" + path + "right-hi." + extension + ")";
    }
    if (settings.hiColor != null) {
      obj.style.color = settings.hiColor;
    }
    if (settings.hiUnderline == true) {
      obj.style.textDecoration = "underline";
    }
  };

  /**
   * Restore the tab's style using the settings when the mouse leaves the tab.
   * @param {MouseEvent} e
   * @returns {undefined}
   */
  this.tabSpanOnmouseout = function(e) {
    var obj = getTarget(e);
    if (obj.tabId == null && obj.parentNode.tabId != null) obj = obj.parentNode;
    if (obj.tabId == me.selectedTab) return;
    if (settings.useImages && settings.hiImages) {
      obj.style.backgroundImage = "url(" + path + "middle." + extension + ")";
      obj.previousSibling.style.backgroundImage = "url(" + path + "left." + extension + ")";
      obj.nextSibling.style.backgroundImage = "url(" + path + "right." + extension + ")";
    }
    if (settings.hiColor != null) {
      obj.style.color = "";
    }
    if (settings.hiUnderline == true) {
      obj.style.textDecoration = "";
    }
  };

  /**
   * Handler for clicking a tab; changes the tab.
   * @param {MouseEvent} e
   * @returns {undefined}
   */
  this.tabSpanOnclick = function(e) {
    var target = e.target;
    me._lastScrollLeft = target.parentNode.parentNode.scrollLeft; // _headerArea is 2 nodes up.
    if (target.tabId == null && target.parentNode.tabId != null) target = target.parentNode;
    var tab = target.tabId;
    if (me.container.ontabclick != null) {
      // Handle the tab panel ontabclick.
      var returnVal = me.container.ontabclick(tab);
      if (returnVal == false) return;
    }

    if (me.container.tabKeys != null) {
      var tabKeysArray = me.container.tabKeys.split(",");
      if (tabKeysArray.length - 1 >= tab) {
        var tabKey = tabKeysArray[tab];
        tabKey = trim(tabKey);
        if (tabKey != "") {
          pressKey(tabKey);
          return;
        }
      }
    }
    me._preValidationSelectedTab = me.selectedTab; // In case validation fails with "tab response", selectedTab will be restored.
    var changed = false;
    if (me.selectedTab != tab) changed = true;
    if (changed) me.selectedTab = tab;
    var design = inDesignMode();
    if (design) {
      var selection = toolbar.designer.selection;
      if (selection.resizers.length > 1) selection.clear();
    }
    if (changed) {
      me.processTabChange(tab);
    }
  };

  /**
   * Event handler to show an inline Edit Box on a tab in Designer.
   * @param {MouseEvent} e
   * @returns {undefined}
   */
  this.tabSpanOndblclick = function(e) {
    if (inDesignMode()) {
      var dom = e.target;
      if (dom.tabId == null && dom.parentNode.tabId != null) dom = dom.parentNode;
      // Get the widget's outer-most div.
      var itmDom = dom.parentNode.parentNode.parentNode;
      var itm = toolbar.designer.getDesignItemByDomObj(itmDom);

      // Add an inline edit-box and a handler for updating it.
      if (!pui.isBound(itm.properties["tab names"]) && !pui.isTranslated(itm.properties["tab names"])) {
        // onUpdate gets called inside InlineEditBox.update, after a call to InlineEditBox.hide.
        itm.designer.inlineEditBox.onUpdate = function(newName) {
          var propValue;
          var idx = dom.tabId;

          // Replace the old name with the new name. Convert string to array,
          // modify element, convert back to string.
          propValue = itm.properties["tab names"];
          if (propValue == "" || propValue == null) propValue = me.INITIALLIST;
          var tabNames = pui.parseCommaSeparatedList(propValue);

          tabNames[idx] = newName;
          propValue = tabNames.join(",");

          // Apply the new value to the "tab names" property.
          var nmodel = getPropertiesNamedModel();
          var propConfig = nmodel["tab names"];
          itm.designer.undo.add(itm, propConfig.name);
          applyPropertyToField(propConfig, itm.properties, itm.dom, propValue, true, itm, null);
          // Tell Designer about the changed property.
          itm.propertiesChanged["tab names"] = true;
          itm.changed = true;
          itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
          itm.designer.propWindow.refreshProperty("tab names");

          // Clear onUpdate's closure references.
          itm.designer.inlineEditBox.onUpdate = null;
          dom = itmDom = itm = null;
        };

        itm.designer.inlineEditBox.show(itm, dom, "tab");
      }
    }
  };

  /**
   * Handle clicking the [+] icon: add a new tab and refresh the properties window.
   * @returns {undefined}
   */
  this.addIconOnclick = function() {
    var itm = toolbar.designer.getDesignItemByDomObj(me.container);
    var propValue = itm.properties["tab names"];
    if (pui.isTranslated(propValue)) {
      // Number of tabs is controlled by this,
      // doesn't make sense to change.
      return;
    }
    else if (pui.isBound(propValue)) {
      var designValue = propValue.designValue;
      if (designValue == null || designValue == "") designValue = me.INITIALLIST;
      designValue = pui.parseCommaSeparatedList(designValue);
      designValue.push("Tab " + (designValue.length + 1));
      propValue.designValue = designValue.join(",");
    }
    else {
      if (propValue == "" || propValue == null) propValue = me.INITIALLIST;
      propValue = pui.parseCommaSeparatedList(propValue);
      propValue.push("New Tab");
      propValue = propValue.join(",");
    }
    // The new tab should be the selected tab.
    var tabNames;
    if (!pui.isBound(propValue) && !pui.isTranslated(propValue)) tabNames = pui.parseCommaSeparatedList(propValue);
    else tabNames = pui.parseCommaSeparatedList(propValue.designValue);

    me.selectedTab = tabNames.length - 1;

    // Setup the tab area to scroll all the way to the right; happens when scroll buttons are handled.
    if (me._headerArea) {
      me._lastScrollLeft = me._headerArea.scrollWidth; // This is too large but will be fixed later.
    }

    var nmodel = getPropertiesNamedModel();
    var propConfig = nmodel["tab names"];
    itm.designer.undo.start("Add New Tab");
    itm.designer.undo.add(itm, propConfig.name);
    applyPropertyToField(propConfig, itm.properties, itm.dom, propValue, true, itm, null);
    itm.propertiesChanged["tab names"] = true;
    itm.changed = true;
    itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
    itm.designer.selection.clear();
    itm.designer.selection.add(itm);
    itm.designer.propWindow.refresh();
  };

  /**
   * Handle clicking [-] icon. Remove the last tab and refresh the properties window.
   * @returns {undefined}
   */
  this.removeIconOnclick = function() {
    var itm = toolbar.designer.getDesignItemByDomObj(me.container);
    var propValue = itm.properties["tab names"];
    var tabNames;
    if (pui.isTranslated(propValue)) {
      // Number of tabs is controlled by this,
      // doesn't make sense to change.
      return;
    }
    else if (pui.isBound(propValue)) {
      var designValue = propValue.designValue;
      if (designValue == null || designValue == "") designValue = me.INITIALLIST;
      propValue.designValue = designValue;
      tabNames = pui.parseCommaSeparatedList(designValue);
    }
    else {
      if (propValue == "" || propValue == null) propValue = me.INITIALLIST;
      tabNames = pui.parseCommaSeparatedList(propValue);
    }
    if (tabNames.length > 1) {
      // See if the tab Panel's last panel contains items. If yes, don't allow remove.
      if (me._cannotRemoveTab(tabNames.length - 1, itm)) {
        itm.designer.selection.clear();
        itm.designer.selection.add(itm);
        itm.designer.propWindow.refresh();
        me.selectedTab = tabNames.length - 1;
        me.drawChanged();
        pui.alert(me.TXT_CANNOTREMOVE);
      }
      else {
        // The tab panel's last panel doesn't contain items, or this is a Tab Layout.
        tabNames.pop();
        var origSelectedTab = me.selectedTab;
        if (me.selectedTab > tabNames.length - 1) me.selectedTab = tabNames.length - 1;
        if (pui.isBound(propValue) || pui.isTranslated(propValue)) propValue.designValue = tabNames.join(",");
        else propValue = tabNames.join(",");
        var nmodel = getPropertiesNamedModel();
        var propConfig = nmodel["tab names"];
        itm.designer.undo.start("Remove Tab");
        itm.designer.undo.add(itm, propConfig.name);
        applyPropertyToField(propConfig, itm.properties, itm.dom, propValue, true, itm, null);
        // Update designer with the new property value. (If the layout rejected the change, these are replaced later.)
        itm.propertiesChanged["tab names"] = true;
        itm.changed = true;
        itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
        itm.designer.propWindow.refreshProperty("tab names");

        // If a new TabLayout wasn't created, then applyProperty failed, and selectedTab should be restored.
        if (itm.dom.layoutT != null && itm.dom.layoutT == me) {
          me.selectedTab = origSelectedTab;
        }
      }
    }
  };

  /**
   * Returns true if widgets are associated with the specified tab; else false.
   * (Overridden in subclass, TabLayout.)
   * @param {Number} removeTabNum   The tab number we're checking for removal.
   * @param {Object} itm            The design item for this tab panel widget.
   * @returns {Boolean}
   */
  this._cannotRemoveTab = function(removeTabNum, itm) {
    for (var i = 0; i < itm.designer.items.length; i++) {
      var elem = itm.designer.items[i].dom;
      if (elem.parentTabPanel != null && elem.parentTab != null && elem.parentTabPanel == me.container.id) {
        if (elem.parentTab == removeTabNum) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Create buttons to scroll tabs left/right, styled like the tabs. (Note: the functions were moved to class methods
   * instead of anoymous declarations here to avoid new functions+closures repeatedly being allocated on resize, etc.)
   * @returns {undefined}
   */
  this.addScrollButtons = function() {
    leftScrollSpan = me._createScrollButton("left");
    rightScrollSpan = me._createScrollButton("right");

    // Avoid overlapping the +/- buttons.
    if (inDesignMode()) rightScrollSpan.style.right = "35px";

    // Setup the click handlers for both buttons.
    leftScrollSpan.onmousedown = leftScroll_onmousedown;
    leftScrollSpan["ontouchstart"] = leftScroll_onmousedown;
    // Stop scrolling.
    leftScrollSpan.onmouseup = leftScroll_onmouseup;
    leftScrollSpan["ontouchend"] = leftScroll_onmouseup;
    leftScrollSpan.onmouseout = leftScrollSpan.onmouseup;
    leftScrollSpan.ondrag = leftScrollSpan.onmouseup;

    rightScrollSpan.onmousedown = rightScroll_onmousedown;
    rightScrollSpan["ontouchstart"] = rightScroll_onmousedown;
    rightScrollSpan.onmouseup = rightScroll_onmouseup;
    rightScrollSpan["ontouchend"] = rightScroll_onmouseup;
    rightScrollSpan.onmouseout = rightScrollSpan.onmouseup;
    rightScrollSpan.ondrag = rightScrollSpan.onmouseup;

    me.container.appendChild(leftScrollSpan);
    me.container.appendChild(rightScrollSpan);
  };

  /**
   * Scroll the top header div to the left when a scroll button is held down.
   * @returns {undefined}
   */
  function scrollLeft() {
    if (me._headerArea.scrollLeft > 0) {
      me._headerArea.scrollLeft -= curScrollIncrement;
    }
    else {
      clearInterval(scrollLeftIval);
      leftScrollSpan.style.display = "none";
    }
    rightScrollSpan.style.display = "inline-block";
    scrollCounter++;
    // Scroll faster the longer the button is held.
    if (scrollCounter > 0 && (scrollCounter % 5) == 0) curScrollIncrement += scrollAccelAmount;
  }

  /**
   * Scroll the top header div to the right when a scroll button is held down.
   * @returns {undefined}
   */
  function scrollRight() {
    // Recalculating this here fixes a problem where topDiv.scrollWidth sometimes reports incorrectly above -- DR.
    var leftMax = me._headerArea.scrollWidth - me._headerArea.offsetWidth;
    if (me._headerArea.scrollLeft < leftMax) {
      // Note: Emulated IE8 sometimes gets Unspecified error setting topDiv.scrollLeft, and I can find no fix.
      // However, actual IE8 in Win XP has no problem with this. So ignore error. MD.
      try {
        me._headerArea.scrollLeft += curScrollIncrement;
      }
      catch (exc) {}
    }
    else {
      clearInterval(scrollRightIval);
      rightScrollSpan.style.display = "none";
    }
    leftScrollSpan.style.display = "inline-block";
    scrollCounter++;
    // Scroll faster the longer the button is held.
    if (scrollCounter > 0 && (scrollCounter % 5) == 0) curScrollIncrement += scrollAccelAmount;
  }

  // Start scrolling.
  function leftScroll_onmousedown() {
    // Reset increment amount and speed counter. Start scrolling.
    curScrollIncrement = beginScrollIncrement;
    scrollCounter = 0;
    scrollLeftIval = setInterval(scrollLeft, 42);
  }
  function rightScroll_onmousedown() {
    curScrollIncrement = beginScrollIncrement;
    scrollCounter = 0;
    scrollRightIval = setInterval(scrollRight, 42);
  }

  // Stop scrolling.
  function leftScroll_onmouseup() {
    clearInterval(scrollLeftIval);
  }
  function rightScroll_onmouseup() {
    clearInterval(scrollRightIval);
  }

  /**
   * Check which scroll buttons should be visible, and show them.
   * @returns {undefined}
   */
  this._checkScrollButtons = function() {
    // Calculate scrollLeftMax: how far from left is the element scrolled.
    var topDiv_scrollLeftMax = me._headerArea.scrollWidth - me._headerArea.offsetWidth;

    // Avoid showing scroll buttons if we are close enough to an end. Fixes
    // button appearing/disappearing when Angle tabs shift by 1 pixel on click.
    if ((topDiv_scrollLeftMax - me._lastScrollLeft) <= 3) me._lastScrollLeft = topDiv_scrollLeftMax;
    else if (me._lastScrollLeft <= 3) me._lastScrollLeft = 0;

    // Restore the previous scrollLeft from before a tab was clicked, or to scroll to the active tab.
    me._headerArea.scrollLeft = me._lastScrollLeft;

    // Display either button only when needed.
    if (me._headerArea.scrollLeft > 0) {
      leftScrollSpan.style.display = "inline-block";
    }
    else {
      leftScrollSpan.style.display = ""; // Stylesheet defaults these spans' display to none.
    }

    if (me._headerArea.scrollLeft < topDiv_scrollLeftMax) {
      rightScrollSpan.style.display = "inline-block";
    }
    else {
      rightScrollSpan.style.display = "";
    }
  };

  /**
   * Create a scroll left or right button in the same style as the tabs.
   *   (Overridden in subclass.)
   * @param {String} cssClass     Extra CSS class: left or right.
   * @returns {Object}            A span DOM element as the tab.
   */
  this._createScrollButton = function(cssClass) {
    // Create a parent span to encapsulate the button image, left, and right border.
    // Note: image is defined by CSS rule like :before { content: url(); }
    var outerSpan = document.createElement("span");
    if (cssClass) outerSpan.className = "pui-tscrbtn " + cssClass;

    // By default, scroll buttons use the same style as a selected tab. Allow
    // them to use style of unselected tab with config option.
    var bgimgSel = "-sel.";
    if (pui["tabpanel scroll unsel style"] == true) bgimgSel = ".";

    if (settings.leftWidth != null) {
      var leftSpan = document.createElement("span");
      leftSpan.className = "edge";
      leftSpan.style.backgroundImage = "url(" + path + "left" + bgimgSel + extension + ")";
      leftSpan.style.height = (settings.height + 2) + "px";
      leftSpan.style.width = settings.leftWidth + "px";
    }
    if (settings.rightWidth != null) {
      var rightSpan = document.createElement("span");
      rightSpan.className = "edge";
      rightSpan.style.backgroundImage = "url(" + path + "right" + bgimgSel + extension + ")";
      rightSpan.style.height = (settings.height + 2) + "px";
      rightSpan.style.width = settings.rightWidth + "px";
    }

    var tabSpan = document.createElement("span");
    tabSpan.className = "mid";
    tabSpan.style.height = settings.height + "px";

    if (settings.useImages) {
      tabSpan.style.backgroundImage = "url(" + path + "middle" + bgimgSel + extension + ")";
      tabSpan.style.backgroundRepeat = "repeat-x";
      var leftMargin = 1;
      if (settings.leftMargin) leftMargin = settings.leftMargin;
      leftSpan.style.marginLeft = leftMargin + "px";
      tabSpan.style.padding = (settings.height - 17) + "px 0.5em 0px"; // image is

      if (settings.separated != true) {
        leftSpan.style.backgroundColor = me.backColor;
        rightSpan.style.backgroundColor = me.backColor;
        tabSpan.style.backgroundColor = me.backColor;

        // 5974 - Remove visible corners
        if (this.tabStyle == "Glass" || this.tabStyle == "Delicate" || this.tabStyle == "Classic") {
          leftSpan.style.backgroundSize = "cover";
          rightSpan.style.backgroundSize = "cover";
          leftSpan.style.backgroundColor = "";
          rightSpan.style.backgroundColor = "";
          leftSpan.style.height = settings.height + "px";
          rightSpan.style.height = settings.height + "px";
        }
      }
      if (settings.selColor != null) tabSpan.style.color = settings.selColor;
      if (settings.selBold == true) tabSpan.style.fontWeight = "bold";
    }
    else {
      tabSpan.style.marginLeft = "3px";
      tabSpan.style.padding = "3px 0.5em";
      tabSpan.style.borderTop = "1px solid " + borderColor;
      tabSpan.style.borderLeft = "1px solid " + borderColor;
      tabSpan.style.borderRight = "1px solid " + borderColor;
      tabSpan.style.borderBottom = "1px solid " + me.backColor;
      // Use color of selected tab unless overridden by config option.
      if (pui["tabpanel scroll unsel style"] != true) {
        tabSpan.style.backgroundColor = me.backColor;
      }
      else if (settings["defaultTabColor"]) tabSpan.style.backgroundColor = settings["defaultTabColor"];
      else {
        tabSpan.style.backgroundColor = simpleSelectedTabBackgroundColor;
      }
    }

    // Add the left border if it, exists, add the tab itself, and add the
    // right border if it exists.
    if (settings.leftWidth != null) outerSpan.appendChild(leftSpan);
    outerSpan.appendChild(tabSpan);
    if (settings.rightWidth != null) outerSpan.appendChild(rightSpan);

    return outerSpan;
  };// end _createScrollButton().
}
TabPanel.prototype = Object.create(pui.BaseClass.prototype); // inherit deleteOwnProperties.

pui.widgets.add({
  name: "tab panel",
  canBelongToGrid: false,
  container: true,
  defaults: {
    width: "300px",
    height: "200px",
    "tab names": "Tab 1,Tab 2,Tab 3",
    "z index": "8",
    color: "#333366",
    "font family": "Arial",
    "font size": "12px"
  },

  propertySetters: {

    "field type": function(parms) {
      parms.dom.sizeMe = function() {
        parms.dom.tabPanel.draw();
      };

      parms.dom.tabPanel = new TabPanel();
      var tabNamesString = parms.evalProperty("tab names");
      if (tabNamesString != null && tabNamesString != "") {
        parms.dom.tabPanel.tabs = pui.parseCommaSeparatedList(tabNamesString);
      }
      else {
        parms.dom.tabPanel.tabs = ["Tab 1", "Tab 2", "Tab 3"];
      }
      parms.dom.tabPanel.selectedTab = 0;
      parms.dom.tabPanel.container = parms.dom;

      parms.dom.tabPanel.tabStyle = parms.properties["tab panel style"];
      if (parms.design && pui.isBound(parms.dom.tabPanel.tabStyle)) {
        parms.dom.tabPanel.tabStyle = "Simple";
      }
      if (parms.properties["background color"] == null || parms.properties["background color"] == "") {
        parms.dom.tabPanel.setDefaultBackColor();
      }

      if (context == "genie" || parms.design) {
        parms.dom.tabPanel.draw();
      }

      if (!parms.design) {
        var tabPanel = parms.dom.tabPanel;
        // set and get current tab api's to the DOM element. Bind because tabPanel, not parms.dom, should be "this" inside these functions. #6785.
        parms.dom.setTab = tabPanel.setTab.bind(tabPanel);
        parms.dom.getTab = tabPanel.getTab.bind(tabPanel);
        parms.dom.refresh = tabPanel.refresh.bind(tabPanel);
        parms.dom["hideTab"] = tabPanel.hideTab.bind(tabPanel);
        parms.dom["showTab"] = tabPanel.showTab.bind(tabPanel);
      }
    },

    "tab names": function(parms) {
      if (parms.dom.tabPanel != null) {
        var tabNamesString = parms.value;
        if (tabNamesString != null && tabNamesString != "") {
          parms.dom.tabPanel.tabs = pui.parseCommaSeparatedList(tabNamesString);
        }
        else {
          parms.dom.tabPanel.tabs = ["Tab 1", "Tab 2", "Tab 3"];
        }
        if (context == "genie" || parms.design) {
          parms.dom.tabPanel.draw();
        }
      }
    },

    "tab keys": function(parms) {
      parms.dom.tabKeys = parms.value;
    },

    "tab panel style": function(parms) {
      parms.dom.tabPanel.tabStyle = parms.value;
      if (parms.properties["background color"] == null || parms.properties["background color"] == "") {
        parms.dom.tabPanel.setDefaultBackColor();
      }
      if (context == "genie" || parms.design) {
        parms.dom.tabPanel.draw();
      }
      pui.widgets.preloadTabStyle(parms.value);
    },

    "width": function(parms) {
      if (parms.design && pui.isPercent(parms.value)) {
        parms.dom.tabPanel.draw();
      }
    },

    "height": function(parms) {
      if (parms.design && pui.isPercent(parms.value)) {
        parms.dom.tabPanel.draw();
      }
    },

    "response AID": function(parms) {
      if (parms.dom.tabPanel) {
        var value = parms.value;
        if (typeof value !== "string" || value.length === 0) value = null;
        parms.dom.tabPanel.responseAID = parms.value;
      }
    }

  }

});
