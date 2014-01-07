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
  
  var me = this;  
  
  this.init = function() {
    me.container.style.overflow = "hidden";
  }
  
  this.setSectionNames = function(nameList) {
    if (nameList == null || nameList == "" || pui.isBound(nameList)) nameList = ["Section 1", "Section 2", "Section 3"];
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
        }

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
    me.expandSection(0);
    me.resize();
  }
  
  this.expandSection = function(sectionNumber) {
    for (var i = 0; i < bodyDivs.length; i++) {
      var bodyDiv = bodyDivs[i];
      var headerButton = headerButtons[i];
      if (i == sectionNumber) {
        headerButton.setIcon("minus");
        headerButton.setDisabled(!allowCollapse);
        bodyDiv.style.display = "";
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
  }
  
  this.setAllowCollapse = function(allow) {
    allowCollapse = (allow == "true" || allow == true);
    me.expandSection(expandedSection);
  }
  
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
  }
    
  this.setStyle = function(styleName, styleValue) {
    for (var i = 0; i < headerButtons.length; i++) {
      headerButtons[i].setStyle(styleName, styleValue);
    }
  }

  this.setAllStyles = function(properties) {
    for (var i = 0; i < headerButtons.length; i++) {
      headerButtons[i].setAllStyles(properties);
    }
  }
  
  this.setMini = function(mini) {
    for (var i = 0; i < headerButtons.length; i++) {
      headerButtons[i].setMini(mini);
    }
    me.resize();
  }

  this.setHeaderSwatch = function(swatch) {
    for (var i = 0; i < headerButtons.length; i++) {
      headerButtons[i].setSwatch(swatch);
    }
    headerSwatch = swatch;
  }

  this.setBodySwatch = function(swatch) {
    for (var i = 0; i < bodyPanels.length; i++) {
      bodyPanels[i].setSwatch(swatch);
    }
    bodySwatch = swatch;
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
  }
  
  this.setHeight = function(height) {
    me.container.style.height = height;
    me.resize(height);
  }
  
}
