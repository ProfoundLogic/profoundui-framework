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
 * @constructor
 */

pui.Accordion = function() {
  this.container = null;
  this.forProxy = false;
  this.designMode = false;
  
  var headerDivs = [];
  var bodyDivs = [];
  var headerButtons = [];
  var bodyPanels = [];
  var straightEdge = "none";
  var headerSwatch = "b";
  var bodySwatch = "c";
  var expandedSection = -1;
  var allowCollapse = false;
  
  var addIcon = null;
  var removeIcon = null;

  var INITIALLIST = pui["getLanguageText"]("runtimeText","section") + " 1,"
                  + pui["getLanguageText"]("runtimeText","section") + " 2,"
                  + pui["getLanguageText"]("runtimeText","section") + " 3";
  
  var me = this;  
  
  this.init = function() {
    me.container.style.overflow = "hidden";
  };
  
  this.setSectionNames = function(nameList) {
    if (nameList == null || nameList == "")
      nameList = INITIALLIST;
    else if (pui.isBound(nameList) || pui.isTranslated(nameList)) {
      var tmplist = pui.parseCommaSeparatedList(nameList.designValue);
      if (tmplist.length == 0 ) nameList = INITIALLIST;
      else nameList = nameList.designValue;   //Use the bound value saved in designer.
    }
    var names = pui.parseCommaSeparatedList(nameList);
    if (names.length != headerDivs.length) {
      me.container.innerHTML = "";
      headerDivs = [];
      bodyDivs = [];
      headerButtons = [];
      bodyPanels = [];
      for (var i = 0; i < names.length; i++) {
        var headerDiv = document.createElement("div");        
        headerDiv.style.width = "100%";
        headerDiv.style.padding = "0";        
        headerDiv.sectionNumber = i;
        headerDiv.onclick = function(e) {
          var target = getTarget(e);
          var sectionNumber = null;
          while (sectionNumber == null && target != null) {
            sectionNumber = target.sectionNumber;
            target = target.parentNode;
          }
          if (sectionNumber != null) {
            if (expandedSection == sectionNumber) {
              sectionNumber = -1;  // collapse
              if (allowCollapse && !me.designMode) {
                me.expandSection(sectionNumber);
              }
            }
            else {
              if (me.container["onsectionclickevent"] != null) {
                var returnVal = me.container["onsectionclickevent"](sectionNumber);
                if (returnVal == false) return;
              }
              me.expandSection(sectionNumber);
            }
          }
        };

        var bodyDiv = document.createElement("div");
        bodyDiv.style.width = "100%";
        bodyDiv.style.height = "175px";
        bodyDiv.style.padding = "0";
        if (i < names.length - 1) {
          bodyDiv.style.overflow = "hidden";
        }

        var headerButton = new pui.CSSButton();
        headerButton.container = headerDiv;
        headerButton.forProxy = me.forProxy;
        headerButton.init();
        headerButton.setSwatch(headerSwatch);
        headerButton.setIcon("plus");
        headerButton.setIconPosition("left");

        var bodyPanel = new pui.CSSPanelSection();
        bodyPanel.type = "body";
        bodyPanel.forLayout = true;
        bodyPanel.container = bodyDiv;
        bodyPanel.init();
        bodyPanel.setSwatch(bodySwatch);
        bodyPanel.setHeight("100%");       
        
        me.container.appendChild(headerDiv);
        me.container.appendChild(bodyDiv);

        headerDivs.push(headerDiv);
        bodyDivs.push(bodyDiv);
        headerButtons.push(headerButton);
        bodyPanels.push(bodyPanel);
      }
    }
    for (var i = 0; i < names.length; i++) {
      headerButtons[i].setText(names[i]);
    }
    me.expandSection(0);    //also calls me.resize().
    
    // Add icons to the container DOM element. The container gets replaced at least once while
    // properties are assigned. But child nodes are migrated to the new DOM (applyTemplate.js:~72).
    if (me.designMode ){
      if( addIcon == null ){
        // Add the + (add) button.
        addIcon = designUtils.createAndAppendIcon("plus",
          pui["getLanguageText"]("runtimeText","add x", [pui["getLanguageText"]("runtimeText","section")] ),
          me.container);
        addIcon.style.right = "2px";
        addIcon.style.bottom = "2px";
        addIcon.onclick = addIconOnclick;
      }else if( addIcon.parentNode == null ){
        // Re-attach icon, which can get removed from DOM in this.setSectionNames (container.innerHTML = "").
        me.container.appendChild(addIcon);
      }
      
      if( names.length > 1 ){         // Only show the remove icon if there exist more than one section.
        if( removeIcon == null  ){
          // Add the - (remove) button.
          removeIcon = designUtils.createAndAppendIcon("minus",
            pui["getLanguageText"]("runtimeText","delete x", [pui["getLanguageText"]("runtimeText","section")] ),
            me.container);
          removeIcon.style.right = "2px";
          removeIcon.style.bottom = "16px";
          removeIcon.onclick = removeIconOnclick;
        }else if( removeIcon.parentNode == null ){
          me.container.appendChild(removeIcon);   //attach icon to newest container DOM.
        }
      }
    }
  };
  
  this.expandSection = function(sectionNumber) {
    for (var i = 0; i < bodyDivs.length; i++) {
      var bodyDiv = bodyDivs[i];
      var headerButton = headerButtons[i];
      if (i == sectionNumber) {
        headerButton.setIcon("minus");
        headerButton.setDisabled(!allowCollapse);
        bodyDiv.style.display = "";
        me.container.responseValue = sectionNumber;
        
        if (me.container.layout != null){
          if (!me.designMode){
            //Lazy loads the items, if they weren't already.
            me.container.layout.renderItems( [sectionNumber] );
          }
          //Make sure any child layouts know they are visible. e.g. child tablayouts may need scrollbars.
          me.container.layout.notifyContainersVisible();
        }
      }
      else {
        headerButton.setIcon("plus");
        headerButton.setDisabled(false);
        bodyDiv.style.display = "none";
      }
    }
    me.setStraightEdge(straightEdge);
    expandedSection = sectionNumber;
    me.resize();
  };
  
  this.setAllowCollapse = function(allow) {
    allowCollapse = (allow == "true" || allow == true);
    me.expandSection(expandedSection);
  };
  
  this.setStraightEdge = function(edge) {
    if (edge == null || pui.isBound(edge)) return;
    straightEdge = edge;
    var n = headerButtons.length;
    if (n <= 0) return;
    for (var i = 0; i < n; i++) {
      headerButtons[i].setStraightEdge("all");
      bodyPanels[i].setStraightEdge("all");
    }
    var topPart = headerButtons[0];
    var bottomPart = bodyPanels[n - 1];
    if (bodyDivs[n - 1].style.display == "none") {
      bottomPart = headerButtons[n - 1];
    }
    if (topPart == bottomPart) {
      topPart.setStraightEdge(edge);
      return;
    }
    
    switch(edge) {
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
    
  this.setStyle = function(styleName, styleValue) {
    for (var i = 0; i < headerButtons.length; i++) {
      headerButtons[i].setStyle(styleName, styleValue);
    }
  };

  this.setAllStyles = function(properties) {
    for (var i = 0; i < headerButtons.length; i++) {
      headerButtons[i].setAllStyles(properties);
    }
  };
  
  this.setMini = function(mini) {
    for (var i = 0; i < headerButtons.length; i++) {
      headerButtons[i].setMini(mini);
    }
    me.resize();
  };

  this.setHeaderSwatch = function(swatch) {
    for (var i = 0; i < headerButtons.length; i++) {
      headerButtons[i].setSwatch(swatch);
    }
    headerSwatch = swatch;
  };

  this.setBodySwatch = function(swatch) {
    for (var i = 0; i < bodyPanels.length; i++) {
      bodyPanels[i].setSwatch(swatch);
    }
    bodySwatch = swatch;
  };
  
  this.resize = function(newHeight) {
    var totalHeight;
    if (typeof newHeight == "string") {
      if (newHeight.length < 3 || newHeight.substr(newHeight.length - 2, 2) != "px") {
        newHeight = null;
      }
    }
    if (newHeight != null && !isNaN(parseInt(newHeight))) totalHeight = parseInt(newHeight);
    else totalHeight = me.container.offsetHeight;

    var buttonHeight = 0;
    if (headerDivs.length > 0) buttonHeight = headerDivs[0].offsetHeight;
    if (buttonHeight == 0) buttonHeight = 42;  // default height

    var bodyHeight = totalHeight - buttonHeight * headerDivs.length;
    if (bodyHeight < 0) bodyHeight = 0;

    var bodyDiv = bodyDivs[expandedSection];
    if (bodyDiv != null) {
      bodyDiv.style.height = bodyHeight + "px";
    }
    if (me.container.layout != null) {
      me.container.layout.sizeContainers();
    }
  };
  
  this.setHeight = function(height) {
    me.container.style.height = height;
    me.resize(height);
  };
  
  /**
   * Interface needed by pui.Layout to know which container's items should be lazy-loaded.
   * @returns {Array}   Returns an array of numbers. In this class, returns just the expanded section.
   */
  this.getActiveContainerNumbers = function(){
    return [expandedSection];
  };
  
  // Private methods.

  // copied mostly from tab_panel addIcon.onclick.
  function addIconOnclick(){
    var itm = toolbar.designer.getDesignItemByDomObj(me.container);
    var propValue = itm.properties["section names"];
    if (pui.isTranslated(propValue)) {
      // Number of sections is controlled by this, doesn't make sense to change.
      return;
    }
    else if (pui.isBound(propValue)) {
      var designValue = propValue.designValue;
      if (designValue == null || designValue == "") designValue = INITIALLIST;
      designValue = pui.parseCommaSeparatedList(designValue);
      designValue.push("Section " + (designValue.length + 1));
      propValue.designValue = designValue.join(",");
    }
    else {
      if (propValue == "" || propValue == null) propValue = INITIALLIST;
      propValue = pui.parseCommaSeparatedList(propValue);
      propValue.push("Section " + (propValue.length + 1) );
      propValue = propValue.join(",");
    }
    applySectionNamesProperty(itm, propValue);
  }
  
  function removeIconOnclick(){
    var itm = toolbar.designer.getDesignItemByDomObj(me.container);
    var propValue = itm.properties["section names"];
    if (pui.isTranslated(propValue)) {
      // Number of sections is controlled by this, doesn't make sense to change.
      return;
    }
    else if (pui.isBound(propValue)) {
      var designValue = propValue.designValue;
      if (designValue == null || designValue == "") designValue = INITIALLIST;
      designValue = pui.parseCommaSeparatedList(designValue);
      designValue.pop();
      propValue.designValue = designValue.join(",");
    }
    else {
      if (propValue == "" || propValue == null) propValue = INITIALLIST;
      propValue = pui.parseCommaSeparatedList(propValue);
      propValue.pop();
      propValue = propValue.join(",");
    }
    applySectionNamesProperty(itm, propValue);
  }
  
  function applySectionNamesProperty(itm, propValue){
    var nmodel = me.container.propertiesNamedModel;
    var propConfig = nmodel["section names"];
    itm.designer.undo.start("Add New Section");
    itm.designer.undo.add(itm, propConfig.name);
    applyPropertyToField(propConfig, itm.properties, itm.dom, propValue, true, itm, null);
    itm.propertiesChanged["section names"] = true;
    itm.changed = true;
    itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
    itm.designer.selection.clear();
    itm.designer.selection.add(itm);
    itm.designer.propWindow.refresh();
  }
  
};
