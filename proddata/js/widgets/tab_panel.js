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
  }
}

pui.widgets.getTabStyles = function() {
  var tabStyleArray = [];
  for (var tabStyle in pui.widgets.tabStyles) {
    tabStyleArray.push(tabStyle);
  }
  tabStyleArray.push("Other...");
  return tabStyleArray;
}

pui.widgets.preloadTabStyle = function(tabStyle) {
  tabStyleSettings = pui.widgets.tabStyles[tabStyle];
  if (tabStyleSettings != null) {
    if (tabStyleSettings.preloaded != true) {   // not already preloaded
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
          preload(path + "left-hi." + extension)
          preload(path + "middle-hi." + extension)
          preload(path + "right-hi." + extension)
        }
        preload(path + "left-sel." + extension)
        preload(path + "middle-sel." + extension)
        preload(path + "right-sel." + extension)
      }
      tabStyleSettings.preloaded = true;
    }
  }
}


/**
 * Tab Panel Class
 * @constructor
 */

function TabPanel() {

  // Private Properties
  var me = this;
  
  // Public Properties
  this.defaults = {};
  this.defaults.fontFamily = "arial";
  this.defaults.fontSize = "12px";
  this.defaults.color = "#333366";
  
  this.tabs = [];
  this.selectedTab = 0;
  this.container = null;
  this.backColor = "#eeeeff";
  
  this.tabStyle = "Simple";
  
  
  // Public Methods  
  this.setDefaultBackColor = function() {
    var settings = pui.widgets.tabStyles[me.tabStyle];
    if (settings != null && settings.defaultBackColor != null) {
      me.backColor = settings.defaultBackColor;
    }
  }
  
  this.draw = function() {
    if (me.tabStyle == null || me.tabStyle == "") me.tabStyle = "Simple";
    var settings = pui.widgets.tabStyles[me.tabStyle];
    if (settings == null) settings = pui.widgets.tabStyles["Simple"];  // a custom widget may not be installed on current system
    var path = pui.normalizeURL("/profoundui/proddata/images/tabs/" + me.tabStyle.toLowerCase() + "/");
    var extension = settings["imageFileExtension"];
    if (extension == null) extension = "gif";
    if (extension.substr(0, 1) == ".") extension = extension.substr(1);
      
    var borderColor = "#aaaaaa";
    if (settings.borderColor != null) borderColor = settings.borderColor;
    
    me.container.innerHTML = "";
    me.container.style.backgroundColor = "";
    
    if (!me.container.style.fontFamily) me.container.style.fontFamily = me.defaults.fontFamily;
    if (!me.container.style.fontSize) me.container.style.fontSize = me.defaults.fontSize;
    if (!me.container.style.color) me.container.style.color = me.defaults.color;

    var adjust = 7;
    if (settings.useImages) adjust = 1;

    var topDiv = document.createElement("div");
    topDiv.style.position = "absolute";
    topDiv.style.left = "0px";
    topDiv.style.top = "0px";
    topDiv.style.height = (settings.height + adjust + 1) + "px";    
    topDiv.style.padding = "0px";
    topDiv.style.whiteSpace = "nowrap";
    topDiv.style.overflow = "hidden"; 

    if (settings.backBar) {
      me.container.style.overflowX = "hidden";
      me.container.style.overflowY = "hidden";
      if (settings.backBarColor != null) {
        topDiv.style.backgroundColor = settings.backBarColor;
      }
      else {
        topDiv.style.backgroundImage = "url(" + path + "middle." + extension + ")";
        topDiv.style.backgroundRepeat = "repeat-x";
      }
    }
    topDiv.style.width = "100%";

    var bottomDiv = document.createElement("div");
    bottomDiv.style.position = "absolute";
    bottomDiv.style.left = "0px";
    bottomDiv.style.top = (settings.height + adjust) + "px";
    bottomDiv.className = "content-area";

    // offsetHeight/Width properties are slow, causing a browser reflow
    //var cntHeight = me.container.offsetHeight;
    //var cntWidth = me.container.offsetWidth;

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
      if (settings.leftWidth != null) {
        var leftSpan = document.createElement("span");
        leftSpan.style.backgroundImage = "url(" + path + "left" + (i == me.selectedTab ? "-sel" : "") + "." + extension + ")";
        leftSpan.style.backgroundRepeat = "no-repeat";
        leftSpan.style.height = (settings.height + 2) + "px";
        leftSpan.style.width = settings.leftWidth + "px";
        leftSpan.style.cssFloat = "left";    // Forefox
        leftSpan.style.styleFloat = "left";  // IE
        leftSpan.style.display = "inline-block";
      }
      if (settings.rightWidth != null) {
        var rightSpan = document.createElement("span");
        rightSpan.style.backgroundImage = "url(" + path + "right" + (i == me.selectedTab ? "-sel" : "") + "." + extension + ")";
        rightSpan.style.backgroundRepeat = "no-repeat";
        rightSpan.style.height = (settings.height + 2) + "px";
        rightSpan.style.width = settings.rightWidth + "px";
        rightSpan.style.cssFloat = "left";    // Forefox
        rightSpan.style.styleFloat = "left";  // IE
        rightSpan.style.display = "inline-block";
      }

      var tabSpan = document.createElement("span");
      tabSpan.tabId = i;
      tabSpan.innerHTML = me.tabs[i];
      tabSpan.style.display = "block";
      tabSpan.style.cssFloat = "left";    // Forefox
      tabSpan.style.styleFloat = "left";  // IE
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
          tabSpan.style.backgroundColor = "#B7C8F6";
          if (context == "genie") {
            tabSpan.style.filter = "progid:DXImageTransform.Microsoft.Gradient(gradientType=0,startColorStr=white,endColorStr=#B7C8F6)";
          }
          tabSpan.style.cursor = "pointer";
        }
        else {
          tabSpan.style.backgroundColor = me.backColor;  
          tabSpan.style.borderBottom = "1px solid " + me.backColor;  
          tabSpan.style.cursor = "default";      
        }        
      }
      
      
      tabSpan.onmouseover = function(e) {
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
      }
      tabSpan.onmouseout = function(e) {
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
      }
      tabSpan.ondblclick = function(e) {
        var isDesign = inDesignMode();
        if (isDesign) {
          var dom = designUtils.getTarget(e);
          if (dom.tabId == null && dom.parentNode.tabId != null) dom = dom.parentNode;
          var itmDom = dom.parentNode.parentNode;
          var itm = toolbar.designer.getDesignItemByDomObj(itmDom);
          if (!pui.isBound(itm.properties["tab names"]) && !pui.isTranslated(itm.properties["tab names"])) {
            itm.designer.inlineEditBox.onUpdate = function(newName) {
              var idx = 0;
              sibling = dom.previousSibling;
              if (sibling != null && sibling.getAttribute("isTab") != "true") sibling = sibling.previousSibling;
              if (sibling != null && sibling.getAttribute("isTab") != "true") sibling = sibling.previousSibling;
              while (sibling != null) {
                idx++;
                sibling = sibling.previousSibling;
                if (sibling != null && sibling.getAttribute("isTab") != "true") sibling = sibling.previousSibling;
                if (sibling != null && sibling.getAttribute("isTab") != "true") sibling = sibling.previousSibling;
              }
              var propValue = itm.properties["tab names"];
              if (propValue == "") propValue = "Tab 1,Tab 2,Tab 3";
              var tabNames = pui.parseCommaSeparatedList(propValue);
              tabNames[idx] = newName;
              //propValue = tabNames[0];
              //for (var i = 1; i < tabNames.length; i++) {
              //  propValue += "," + tabNames[i];
              //}
              propValue = tabNames.join(",");
              var nmodel = getPropertiesNamedModel();
              var propConfig = nmodel["tab names"];
              itm.designer.undo.add(itm, propConfig.name);
              applyPropertyToField(propConfig, itm.properties, itm.dom, propValue, true, itm, null);
              itm.propertiesChanged["tab names"] = true;
              itm.changed = true;
              itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
              itm.designer.propWindow.refreshProperty("tab names");
            }
            itm.designer.inlineEditBox.show(itm, dom, "tab");
          }
        }
      }
      tabSpan.onclick = function(e) {
        var target = getTarget(e);
        if (target.tabId == null && target.parentNode.tabId != null) target = target.parentNode;
        var tab = target.tabId;
        if (me.container.ontabclick != null) {
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
        var changed = false;
        if (me.selectedTab != tab) changed = true;
        if (changed) me.selectedTab = tab;
        var design = inDesignMode();
        if (design) {
          var selection = toolbar.designer.selection;
          if (selection.resizers.length > 1) selection.clear();
        }
        if (changed) {
          var dom = me.container;
          if (dom.disabled != true) {
            if (context == "dspf" && dom.sendTabResponse == true) {
              dom.responseValue = tab;
              if (dom.bypassValidation == "true" || dom.bypassValidation == "send data") {
                pui.bypassValidation = dom.bypassValidation;
              }
              var returnVal = pui.respond();
              if (returnVal == false) dom.responseValue = null;
            }
            else {
              me.draw();
              if (context == "dspf" && dom.sendActiveTab == true) {
                dom.responseValue = tab;
              }
            }
          }
        }
      }
      if (settings.leftWidth != null) topDiv.appendChild(leftSpan);
      topDiv.appendChild(tabSpan);
      if (settings.rightWidth != null) topDiv.appendChild(rightSpan);
    }
    me.container.appendChild(bottomDiv);
    me.container.appendChild(topDiv);
    
    var isDesign = inDesignMode();

    if (isDesign) {
      function createIcon(type, tooltipText) {
        var icon = document.createElement("div");
        icon.style.position = "absolute";
        icon.style.width = "16px";
        icon.style.height = "18px";
        icon.style.fontSize = "0px";
        icon.style.overflow = "hidden";
        icon.style.backgroundImage = "url('" + pui.normalizeURL("/profoundui/proddata/images/icons/") + type + ".gif')";
        icon.style.backgroundRepeat = "no-repeat";
        icon.style.cursor = "pointer";
        icon.title = tooltipText;
        icon.style.color = "white";
        icon.style.padding = "0px";
        icon.onmousedown = function(event) {
          designUtils.preventEvent(event);
        }
        me.container.appendChild(icon);  
        return icon;
      }
      var addIcon = createIcon("plus", "Add New Tab");
      var removeIcon = createIcon("minus", "Remove Tab");
      var x = me.container.offsetWidth - 20;
      var y = 2;
      addIcon.style.left = x + "px";
      addIcon.style.top = y + "px";
      x -= 14;
      removeIcon.style.left = x + "px";
      removeIcon.style.top = y + "px";
      addIcon.onclick = function() {
        var itm = toolbar.designer.getDesignItemByDomObj(me.container);
        var propValue = itm.properties["tab names"];
        if (pui.isTranslated(propValue)) {
          // Number of tabs is controlled by this, 
          // doesn't make sense to change.
          return;
        }
        else if (pui.isBound(propValue)) {
          var designValue = propValue.designValue;
          if (designValue == null || designValue == "") designValue = "Tab 1,Tab 2,Tab 3";
          designValue = pui.parseCommaSeparatedList(designValue);
          designValue.push("Tab " + (designValue.length + 1));
          propValue.designValue = designValue.join(",");
        }
        else {
          if (propValue == "") propValue = "Tab 1,Tab 2,Tab 3";
          propValue = pui.parseCommaSeparatedList(propValue);
          propValue.push("New Tab");
          propValue = propValue.join(",");
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
        var tabNames;
        if (!pui.isBound(propValue) && !pui.isTranslated(propValue)) tabNames = pui.parseCommaSeparatedList(propValue);
        else tabNames = pui.parseCommaSeparatedList(propValue.designValue);
        me.selectedTab = tabNames.length - 1;
        me.draw();
      }
      removeIcon.onclick = function() {
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
          if (designValue == null || designValue == "") designValue = "Tab 1,Tab 2,Tab 3";
          propValue.designValue = designValue;
          tabNames = pui.parseCommaSeparatedList(designValue);
        }
        else {
          if (propValue == "") propValue = "Tab 1,Tab 2,Tab 3";
          tabNames = pui.parseCommaSeparatedList(propValue);
        }
        if (tabNames.length > 1) {
          var canRemove = true;
          for (var i = 0; i < itm.designer.items.length; i++) {
            var elem = itm.designer.items[i].dom;
            if (elem.parentTabPanel != null && elem.parentTab != null && elem.parentTabPanel == me.container.id) {
              if (elem.parentTab == tabNames.length - 1) {
                canRemove = false;
                break;
              }
            }
          }
          if (!canRemove) {
            itm.designer.selection.clear();
            itm.designer.selection.add(itm);
            itm.designer.propWindow.refresh();
            me.selectedTab = tabNames.length - 1;
            me.draw();
            pui.alert("The tab cannot be removed because it contains other elements that must be removed first.");
          }
          else {
            tabNames.pop();
            if (me.selectedTab > tabNames.length - 1) me.selectedTab = tabNames.length - 1;
            if (pui.isBound(propValue) || pui.isTranslated(propValue)) propValue.designValue = tabNames.join(",");
            else propValue = tabNames.join(",");
            var nmodel = getPropertiesNamedModel();
            var propConfig = nmodel["tab names"];
            itm.designer.undo.start("Remove Tab");
            itm.designer.undo.add(itm, propConfig.name);
            applyPropertyToField(propConfig, itm.properties, itm.dom, propValue, true, itm, null);
            itm.propertiesChanged["tab names"] = true;
            itm.changed = true;
            itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
            itm.designer.propWindow.refreshProperty("tab names");
          }
        }
      }
    }

    processElements("div");
    processElements("input");
    processElements("select");
    processElements("textarea");
    processElements("button");
    processElements("img");
    
    function processElements(tag) {
      var container;
      if (context == "dspf" && !isDesign) {
        container = pui.runtimeContainer;
      }
      else {
        container = document.getElementById(appContainerId)
      }
      elems = container.getElementsByTagName(tag);
      for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (elem.parentTabPanel != null && elem.parentTab != null && elem.parentTabPanel == me.container.id) {
          if (elem.parentTab == me.selectedTab) {
            elem.style.visibility = "";
            if (elem.chart != null) elem.style.display = "";
            if (elem.calimg) elem.calimg.style.visibility = "";
            if (!isDesign && elem.spinner) elem.spinner.show();
            if (!isDesign && elem.labelObj) elem.labelObj.style.visibility = "";
            if (elem.grid && elem.grid.setProperty) {
              if (elem.grid.hasHeader || !elem.grid.subfileHidden) elem.grid.show();
              else elem.grid.hide();
            }
          }
          else {
            elem.style.visibility = "hidden";
            if (elem.chart != null) elem.style.display = "none";
            if (elem.calimg) elem.calimg.style.visibility = "hidden";
            if (!isDesign && elem.spinner) elem.spinner.hide();
            if (!isDesign && elem.labelObj) elem.labelObj.style.visibility = "hidden";
            if (elem.grid && elem.grid.setProperty) elem.grid.hide();
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

  }
}






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
      }
    
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
      if (parms.properties["background color"] == null || parms.properties["background color"] == "") {      
        parms.dom.tabPanel.setDefaultBackColor();
      }

      if (context == "genie" || parms.design) {
        parms.dom.tabPanel.draw();
      }
      
      if (!parms.design) {
        // set and get current tab api's
        parms.dom.setTab = function(tab) {
          parms.dom.tabPanel.selectedTab = tab;
          parms.dom.tabPanel.draw();
        }
        parms.dom.getTab = function() {
          return parms.dom.tabPanel.selectedTab;
        }
        parms.dom.refresh = function() {
          parms.dom.setTab(parms.dom.getTab());
        }
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
    
    "tab panel style" : function(parms) {
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
    }
 
  }
  
});



