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
 * Menu Widget Class
 * @constructor
 */

pui.MenuWidget = function() {

  // Private Properties
  var me = this;
  var displayedSubMenus = [];

  // Public Properties
  this.container = null;
  this.choices = [];
  this.choiceValues = [];  
  this.hoverBackgroundColor = null;
  this.hoverTextColor = null;
  this.animate = true;
  this.borderColor = null;
  this.padding = "5px";  
  this.paddingLeft = "5px";  
  this.optionImage = null;
  this.optionHoverImage = null;
  this.orientation = "vertical";
  
  // private functions
  function drawMenu(parms) {
    var container = parms.container;
    var parentTable = parms.parentTable;

    container.innerHTML = "";
    container.style.padding = "0px";
    
    var table = document.createElement("table");
    var cwidth = container.style.width;
    if (cwidth != null && cwidth != "" && parms.orientation != "horizontal") {
      table.style.width = "100%";
    }
    if (parms.orientation == "horizontal") {
      container.style.textAlign = "left";
    }
    table.cellPadding = 0;
    table.cellSpacing = 0;
    table.style.color = container.style.color;
    table.style.fontFamily = container.style.fontFamily;
    table.style.fontSize = container.style.fontSize;
    table.style.fontVariant = container.style.fontVariant;
    table.style.fontWeight = container.style.fontWeight;
    table.style.letterSpacing = container.style.letterSpacing;
    table.style.textAlign = container.style.textAlign;
    if (container.textAlignOriginal != null) table.style.textAlign = container.textAlignOriginal;
    table.style.textDecoration = container.style.textDecoration;
    table.style.textTransform = container.style.textTransform;
    table.style.wordSpacing = container.style.wordSpacing;
    table.style.backgroundColor = container.style.backgroundColor;
    
    var mainLevel = getLevel(parms.from);
    var prevTR;
    
    var css;
    if (window.getComputedStyle) {
      css = window.getComputedStyle(container);
    }
    
    for (var i = parms.from; i <= parms.to; i++) {
      if (getLevel(i) != mainLevel) continue;
      var choice = me.choices[i];
      while (choice.substr(0,1) == "-") {
        choice = choice.substr(1);
      }
      var choiceValue = me.choiceValues[i];
      if (choiceValue == null) choiceValue = choice;
      var tr;
      if (prevTR == null || parms.orientation == "vertical") {
        tr = table.insertRow(table.rows.length);
      }
      else {
        tr = prevTR;
      }
      //tr.style.backgroundColor = container.style.backgroundColor;
      var td = tr.insertCell(tr.cells.length);
      if (choice == null || choice == "" || trim(choice) == "") choice = "&nbsp;";
      td.innerHTML = choice;
      td.choiceValue = choiceValue;
      td.level = mainLevel;
      td.menuId = me.container.id;
      td.orientation = parms.orientation;
      if (!pui.iPadEmulation) {
        if (container.cursor != null && container.cursor != "") {
          td.style.cursor = container.cursor;
        }
        else {
          td.style.cursor = "pointer";
        }
      }
      td.style.padding = me.padding;
      td.style.paddingLeft = me.paddingLeft;
      var bcolor = me.borderColor;
      if (css != null && css.getPropertyValue != null) {
        if (bcolor == "" || bcolor == null) {
          bcolor = css.getPropertyValue("border-color");
          if (bcolor == "" || bcolor == null) {
            bcolor = css.getPropertyValue("border-left-color");
          }
        }
      }
      if (bcolor != "" && bcolor != null) {
        bcolor = pui.normalizeColor(bcolor);
        if (table.rows.length <= 1) td.style.borderTop = "1px solid " + bcolor;
        td.style.borderLeft = "1px solid " + bcolor;
        td.style.borderRight = "1px solid " + bcolor;
        td.style.borderBottom = "1px solid " + bcolor;
      }
      
      td.style.filter = "alpha(opacity=100)";
      td.style.opacity = 1;
      if (me.optionImage != null && me.optionImage != "") {
        td.style.backgroundImage = "url('" + pui.normalizeURL(me.optionImage, true) + "')";
        var repeat = me.repeat;
        if (repeat == null) repeat = "repeat";
        td.style.backgroundRepeat = repeat;
      }
      else {
        td.style.backgroundImage = "";
      }
      //td.style.backgroundRepeat = "no-repeat";
      if (hasSubMenu(i)) {
        td.subMenuFrom = i + 1;
        td.subMenuTo = i + 1;
        var subMenuLevel = getLevel(i + 1);
        while (td.subMenuTo < me.choices.length - 1 && getLevel(td.subMenuTo + 1) >= subMenuLevel) {
          td.subMenuTo += 1;
        }
        if (parms.orientation == "vertical") {
          var arrow = document.createElement("img");
          arrow.src = pui.normalizeURL("/profoundui/proddata/images/menus/submenu-arrow.gif");
          arrow.style.position = "absolute";
          arrow.style.right = "3px";
          arrow.style.paddingTop = "3px";
          arrow.isSubMenuArrow = true;
          var span = document.createElement("span");
          span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
          span.isSubMenuArrow = true;
          td.appendChild(span);
          td.appendChild(arrow);
        }
      }
	  
      function assignEvents(td) {
        td.onmouseover = function() {
          td.animationDone = true;
          if (me.hoverBackgroundColor != null && me.hoverBackgroundColor != "") {
            td.style.backgroundColor = me.hoverBackgroundColor;
          }
          else {
            td.className = "menu-hover";
          }
          if (me.hoverTextColor != null && me.hoverTextColor != "") td.style.color = me.hoverTextColor;
          if (me.optionHoverImage != null && me.optionHoverImage != "") {
            td.style.backgroundImage = "url('" + me.optionHoverImage + "')";
            var repeat = me.repeat;
            if (repeat == null) repeat = "repeat";
            td.style.backgroundRepeat = repeat;
          }
          else {
            if (me.optionImage != null && me.optionImage != "") {
              td.style.backgroundImage = "url('" + me.optionImage + "')";
            }
            else {
              td.style.backgroundImage = "";
            }
          }
          removeSameOrHigherLevelMenus(td);
          me.showSubMenu(td)
        }
        td.onmouseout = function(e) {
          if (!e) e = window.event;
          var tgt = e.relatedTarget;
          if (tgt == null) tgt = e.toElement;
          
          // Some browsers (IE8) seem to set the "toElement" to the <TABLE>
          // instead of the <TD> that this routine expects.  This finds the <TD>...
          while (tgt!=null && ( tgt.tagName == "TABLE" 
                 || tgt.tagName == "TBODY" 
                 || tgt.tagName == "TR")) {
            if (tgt.firstChild == null) break;
            tgt = tgt.firstChild;
          }
          
          if (tgt == null || tgt.level == null || tgt.tagName != "TD" || tgt.menuId != me.container.id) {
            var keep = false;
            if (tgt != null) {
              if (tgt == table) keep = true;
              if (parentTable != null && tgt == parentTable) keep = true;
              if (tgt.isSubMenuArrow) keep = true;
            }
            if (!keep) {
              me.removeAllSubMenus();
            }
          }
          else if (td.subMenuContainer != null) {
            var hideMenu = true;
            while (tgt != null) {
              if (td.subMenuContainer == tgt) {
                hideMenu = false;
                break;
              }
              tgt = tgt.parentNode;
            }
            if (hideMenu) {
              me.removeSubMenu(td);
            }
          }
          if (me.hoverTextColor != null && me.hoverTextColor != "") td.style.color = "";
          if (me.optionImage != null && me.optionImage != "") {
            td.style.backgroundImage = "url('" + me.optionImage + "')";
            var repeat = me.repeat;
            if (repeat == null) repeat = "repeat";
            td.style.backgroundRepeat = repeat;
          }
          else {
            td.style.backgroundImage = "";
          }
          if (me.hoverBackgroundColor != null && me.hoverBackgroundColor != "") {
            td.animationDone = false;
            if (me.animate) {
              function animate(opacity) {
                opacity = opacity - 10;
                if (opacity < 40) {;
                  if (!td.animationDone) {
                    td.style.backgroundColor = "";
                  }
                  td.animationDone = true;
                }
                if (td.animationDone) opacity = 100;
                td.style.filter = "alpha(opacity=" + opacity + ")";
                td.style.opacity = opacity / 100;
                if (td.animationDone) return;
                setTimeout(function() { animate(opacity) }, 60);
              }
              animate(100);
            }
            else {
              td.style.backgroundColor = "";
            }
          }
          else {
            td.className = "";
          }      
        }
        td.onclick = function() {
          if (td.level > 0 && td.subMenuFrom == null) me.removeAllSubMenus();
          if (me.container["onoptionclick"] != null) {
            if (inDesignMode()) return;
            if (td.subMenuFrom != null) return;
            me.container["onoptionclick"](td.choiceValue, getInnerText(td));            
          }
          else if (context == "dspf") {
            if (td.subMenuFrom != null) return;
            var dom = me.container;
            if (dom.responseValue == null) return;
            if (dom.disabled == true) return;
            dom.responseValue = td.choiceValue;
            if (dom.bypassValidation == "true" || dom.bypassValidation == "send data") {
              pui.bypassValidation = dom.bypassValidation;
            }
            var returnVal = pui.respond();
            if (returnVal == false) dom.responseValue = "";
          }
        }
        td.ondblclick = function(e) {
          var isDesign = inDesignMode();
          if (isDesign && td.orientation == "vertical" && td.level == 0) {
            var dom = designUtils.getTarget(e);
            var itmDom = dom.parentNode;
            while (itmDom.tagName != "DIV") {
              itmDom = itmDom.parentNode;
            }            
            var itm = toolbar.designer.getDesignItemByDomObj(itmDom);
            if (!pui.isBound(itm.properties["choices"]) && !pui.isTranslated(itm.properties["choices"])) {
              itm.designer.inlineEditBox.onUpdate = function(newName) {
                var idx = 0;
                sibling = dom.parentNode.previousSibling;
                while (sibling != null) {
                  idx++;
                  sibling = sibling.previousSibling;
                }
                var propValue = itm.properties["choices"];
                if (propValue == "") propValue = "Option 1,Option 2,Option 3";
                var optionNames = propValue.split(",");
                optionNames[idx] = newName;
                propValue = optionNames.join(",");
                var nmodel = getPropertiesNamedModel();
                var propConfig = nmodel["choices"];
                itm.designer.undo.add(itm, propConfig.name);
                applyPropertyToField(propConfig, itm.properties, itm.dom, propValue, true, itm, null);
                itm.propertiesChanged["choices"] = true;
                itm.changed = true;
                itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
                itm.designer.propWindow.refreshProperty("choices");
              }
              itm.designer.inlineEditBox.show(itm, dom, "menu");
            }
          }
        }
      }
      assignEvents(td);
      prevTR = tr;
    }
    container.appendChild(table);
  }


  function getLevel(idx) {
    var choice = me.choices[idx];
    var level = 0;
    if (choice == null) return level;
    for (var i = 0; i < choice.length; i++) {
      if (choice.substr(i, 1) == "-") level += 1;
      else break;
    }
    return level;
  }
  
  function hasSubMenu(idx) {
    if (idx >= me.choices.length - 1) return false;
    if (getLevel(idx) + 1 == getLevel(idx+1)) return true;  // next item is one level higher
    return false;
  }

  function removeSameOrHigherLevelMenus(td) {
    var toRemove = [];
    for (var i = 0; i < displayedSubMenus.length; i++) {
      if (displayedSubMenus[i].level >= td.level) {
        toRemove.push(displayedSubMenus[i]);
      }
    }
    for (var i = 0; i < toRemove.length; i++) {
      me.removeSubMenu(toRemove[i]);
    }
  }

  
  // Public Methods
  this.draw = function() {
    drawMenu({
      container: me.container,
      orientation: me.orientation,
      from: 0,
      to: me.choices.length - 1
    });
  }
  
  this.showSubMenu = function(td) {
    if (td.subMenuFrom == null) return;  // this option does not have a sub menu
    var table = td;
    while (table.tagName != "TABLE") {
      table = table.parentNode;
    }
    var parentContainer = table.parentNode;
    if (td.subMenuContainer == null) {
      td.subMenuContainer = document.createElement("div");
      td.subMenuContainer.className = parentContainer.className;
      destStyle = td.subMenuContainer.style;
      sourceStyle = parentContainer.style;
      destStyle.backgroundColor = sourceStyle.backgroundColor;
      destStyle.letterSpacing = sourceStyle.letterSpacing;
      destStyle.wordSpacing = sourceStyle.wordSpacing;
      destStyle.textAlign = sourceStyle.textAlign;
      if (parentContainer.textAlignOriginal != null) {
        destStyle.textAlign = parentContainer.textAlignOriginal;
        td.subMenuContainer.textAlignOriginal = parentContainer.textAlignOriginal;
      }
      destStyle.textDecoration = sourceStyle.textDecoration;
      destStyle.textTransform = sourceStyle.textTransform;
      destStyle.fontVariant = sourceStyle.fontVariant;
      destStyle.fontWeight = sourceStyle.fontWeight;
      destStyle.fontSize = sourceStyle.fontSize;
      destStyle.fontFamily = sourceStyle.fontFamily;
      destStyle.color = sourceStyle.color;
      destStyle.zIndex = sourceStyle.zIndex;
      destStyle.position = "absolute";
      me.container.parentNode.appendChild(td.subMenuContainer);              
    }
    if (td.orientation == "vertical") {
      td.subMenuContainer.style.top = (parentContainer.offsetTop + td.offsetTop) + "px";
      td.subMenuContainer.style.left = (parentContainer.offsetLeft + parentContainer.offsetWidth - 1) + "px";
    }
    else {
      td.subMenuContainer.style.top = (parentContainer.offsetTop + td.offsetTop + td.offsetHeight - 1) + "px";
      td.subMenuContainer.style.left = (parentContainer.offsetLeft + td.offsetLeft) + "px";
    }
    td.subMenuContainer.style.display = "";
    parentContainer.style.display = "";
    drawMenu({
      container: td.subMenuContainer,
      orientation: "vertical",
      from: td.subMenuFrom,
      to: td.subMenuTo,
      parentTable: table
    });
    var minWidth = 100;
    if (td.orientation == "horizontal" && td.level == 0 && td.offsetWidth > minWidth) {
      minWidth = td.offsetWidth;
    }
    if (td.subMenuContainer.offsetWidth < minWidth) {
      td.subMenuContainer.style.width = minWidth + "px";
      var table = td.subMenuContainer.firstChild;
      table.style.width = "100%";
    }
    var addToArray = true;
    for (var i = 0; i < displayedSubMenus.length; i++) {
      if (displayedSubMenus[i] == td) {
        addToArray = false;
        break;
      }
    }
    if (addToArray) displayedSubMenus.push(td);
  }
  
  this.removeSubMenu = function(td) {
    if (td.subMenuContainer == null) return;
    for (var i = 0; i < displayedSubMenus.length; i++) {
      if (displayedSubMenus[i] == td) {
        displayedSubMenus.splice(i, 1);
        break;
      }
    }
    td.subMenuContainer.parentNode.removeChild(td.subMenuContainer);
    td.subMenuContainer = null;
  }
  
  this.removeAllSubMenus = function() {
    var toRemove = [];
    for (var i = 0; i < displayedSubMenus.length; i++) {
      toRemove.push(displayedSubMenus[i]);
    }
    for (var i = 0; i < toRemove.length; i++) {
      me.removeSubMenu(toRemove[i]);
    }  
  }

}




pui.widgets.add({
  name: "menu",
  canBelongToGrid: false,
  defaults: {
    width: "200px",
    height: "200px",
    "choices": "Option 1,Option 2,Option 3,Option 4,Option 5",
    color: "#333366",
    "border color": "#EEEEEE",
    "font family": "Arial",
    "font size": "12px",
    "background color": "#FFFFFF",
    "hover background color": "#6699FF",
    "hover text color": "#FFFFFF",
    animate: "true"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.style.overflowY = "auto";
      parms.dom.menuWidget = new pui.MenuWidget();
      var choices = parms.evalProperty("choices");
      if (choices != null && choices != "") {
        parms.dom.menuWidget.choices = pui.parseCommaSeparatedList(choices);
      }
      else {
        parms.dom.menuWidget.choices = ["Option 1", "Option 2", "Option 3"];
      }
      parms.dom.menuWidget.container = parms.dom;
      parms.dom.menuWidget.hoverTextColor = parms.properties["hover text color"];
      parms.dom.menuWidget.hoverBackgroundColor = parms.properties["hover background color"];
      parms.dom.menuWidget.borderColor = parms.properties["border color"];
      parms.dom.menuWidget.optionImage = parms.properties["option image"];
      parms.dom.menuWidget.optionHoverImage = parms.properties["option hover image"];
      parms.dom.menuWidget.repeat = parms.properties["background repeat"];
      parms.dom.menuWidget.padding = parms.properties["menu option padding"];
      if (parms.dom.menuWidget.padding == null || parms.dom.menuWidget.padding == "") parms.dom.menuWidget.padding = "5px";
      parms.dom.menuWidget.paddingLeft = parms.properties["menu option indent"];
      if (parms.dom.menuWidget.paddingLeft == null || parms.dom.menuWidget.paddingLeft == "") parms.dom.menuWidget.paddingLeft = "5px";
      parms.dom.menuWidget.animate = (parms.properties["animate"] != "false");
      var orientation = parms.properties["orientation"];
      if (orientation != "horizontal" && orientation != "vertical") {
        orientation = "vertical";  // default
      }
      parms.dom.menuWidget.orientation = orientation;
      parms.dom.menuWidget.draw();
    },
    
    "choices": function(parms) {
      if (parms.dom.menuWidget != null) {
        var choices = parms.value;
        if (choices != null && choices != "") {
          parms.dom.menuWidget.choices = pui.parseCommaSeparatedList(choices);
        }
        else {
          parms.dom.menuWidget.choices = ["Option 1", "Option 2", "Option 3"];
        }
        parms.dom.menuWidget.draw();
      }
    },
    
    "choice values": function(parms) {
      if (parms.dom.menuWidget != null) {
        var choiceValues = parms.value;
        if (choiceValues != null && choiceValues != "") {
          parms.dom.menuWidget.choiceValues = pui.parseCommaSeparatedList(choiceValues);
        }
        else {
          parms.dom.menuWidget.choiceValues = [];
        }
      }
    },
    
    "hover background color": function(parms) {
      if (parms.dom.menuWidget != null) {
        parms.dom.menuWidget.hoverBackgroundColor = parms.value;
      }
    },
    
    "hover text color": function(parms) {
      if (parms.dom.menuWidget != null) {
        parms.dom.menuWidget.hoverTextColor = parms.value;
      }
    },

    "animate": function(parms) {
      if (parms.dom.menuWidget != null) {
        if (parms.value == "false") {
          parms.dom.menuWidget.animate = false;
        }
        else {
          parms.dom.menuWidget.animate = true;
        }
        parms.dom.menuWidget.draw();
      }
    },
    
    "border color": function(parms) {
      if (parms.dom.menuWidget != null) {
        parms.dom.menuWidget.borderColor = parms.value;
        parms.dom.menuWidget.draw();
      }
    },
    
    "menu option padding": function(parms) {
      if (parms.dom.menuWidget != null) {
        if (parms.value == null || parms.value == "") parms.dom.menuWidget.padding = "5px";        
        else parms.dom.menuWidget.padding = parms.value;        
        parms.dom.menuWidget.draw();
      }
    },

    "menu option indent": function(parms) {
      if (parms.dom.menuWidget != null) {
        if (parms.value == null || parms.value == "") parms.dom.menuWidget.paddingLeft = "5px";        
        else parms.dom.menuWidget.paddingLeft = parms.value;        
        parms.dom.menuWidget.draw();
      }
    },

    "option image": function(parms) {
      if (parms.dom.menuWidget != null) {
        parms.dom.menuWidget.optionImage = parms.value;
        parms.dom.menuWidget.draw();
      }
    },

    "option hover image": function(parms) {
      if (parms.dom.menuWidget != null) {
        parms.dom.menuWidget.optionHoverImage = parms.value;
        parms.dom.menuWidget.draw();
      }
    },

    "background repeat": function(parms) {
      if (parms.dom.menuWidget != null) {
        parms.dom.menuWidget.repeat = parms.value;
        parms.dom.menuWidget.draw();
      }
    },

    "orientation": function(parms) {
      if (parms.dom.menuWidget != null) {
        var orientation = parms.value;
        if (orientation != "horizontal" && orientation != "vertical") {
          orientation = "vertical";  // default
        }
        parms.dom.menuWidget.orientation = orientation;
        parms.dom.menuWidget.draw();
      }
    },
    
    "text align": function(parms) {
      parms.dom.textAlignOriginal = parms.value;
    }

  },
  
  globalPropertySetter: function(parms) {    
    switch (parms.propertyName) {
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
      case "background color":   
      case "css class":
      case "css class 2":
      case "css class 3":
      case "css class 4":
        if (parms.dom.menuWidget != null) {
          setTimeout(function() { parms.dom.menuWidget.draw() }, 0);
        }
        break;
    }
  }
  
});






