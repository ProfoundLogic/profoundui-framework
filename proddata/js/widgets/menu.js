//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2018 Profound Logic Software, Inc.
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
  this.repeat = null; // background-repeat property and style.
  this.borderColor = null;
  this.padding = null;  
  this.paddingLeft = null;
  this.optionImage = null;
  this.optionImages = [];
  this.optionHoverImage = null;
  this.orientation = "vertical";
  
  // private functions
  function drawMenu(parms) {
    var container = parms.container;
    var parentTable = parms.parentTable;
    // The showing property gets set in the Grid.js and gets checked when hiding the Menu.
    // If the menu happens to have the same ID as another menu in a different record format, 
    // the menu will be hidden after the other one is displayed. #3870
    if (container.showing == undefined) container.showing = true;
    container.innerHTML = "";
    // Apply the styles from profoundui.css. 
    pui.addCssClass(container, "pui-menu");
    
    if( parms.orientation == "horizontal")
      pui.addCssClass(container, "pui-horizontal");

    var table = document.createElement("table");
    var cwidth = container.style.width;
    if (cwidth != null && cwidth != "" && parms.orientation != "horizontal") {
      table.style.width = "100%";
    }
    table.cellPadding = 0;
    table.cellSpacing = 0;

    var mainLevel = getLevel(parms.from);
    var prevTR;

    var bcolor = me.borderColor;
    // If the menu's "border color" property was set, apply it to the table top
    // and left border. Cells will get bottom/right borders later. Otherwise,
    // CSS border handles style.
    if (bcolor != "" && bcolor != null) {
      bcolor = pui.normalizeColor(bcolor);
      table.style.borderTop = "1px solid "+bcolor;
      table.style.borderLeft = "1px solid "+bcolor;
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

      var td = tr.insertCell(tr.cells.length);
      if (choice == null || choice == "" || trim(choice) == "") choice = "&nbsp;";
      td.innerHTML = choice;
      td.choiceValue = choiceValue;
      td.level = mainLevel;
      if(inDesignMode()) td.choiceNum = i; // Needed for double-click to edit menu with submenus in designer.
      td.menuId = me.container.id;
      td.orientation = parms.orientation;
      
      // Set inline padding of table cells if "menu option padding" is set.
      if(me.padding != null && me.padding.length > 0){
        // Set the top, bottom, and right. Allows the padding-left to get the default value
        // of 5px if "menu option indent" is not set and "menu option padding" is set.
        td.style.paddingTop = td.style.paddingBottom = td.style.paddingRight = me.padding;
      }
      // Set inline padding if "menu option indent" is set (Otherwise, CSS sets padding)
      if(me.paddingLeft != null && me.paddingLeft.length > 0) td.style.paddingLeft = me.paddingLeft;

      // Set inline border if the menu "border color" property is set. Otherwise, css sets it.
      if (bcolor != "" && bcolor != null) {
          td.style.borderRight = "1px solid " + bcolor;
          td.style.borderBottom = "1px solid " + bcolor;
      }
      
      // Animating the fade-out, hover color requires inline opacity.
      if (me.animate){
        td.style.filter = "alpha(opacity=100)";
        td.style.opacity = 1;
      }
      
      // Table cell backgrounds get the option-image property if set.
      if (me.optionImage != null && me.optionImage != "") {
        td.optionImage = me.optionImage;
        // Try using a unique image for this menu option.
        if (me.optionImages.length > 1) {
          if (me.optionImages[i] != null) {
            td.optionImage = me.optionImages[i];
          }
          else {
            td.optionImage = "";
          }
        }
        if (td.optionImage != "") {
          td.style.backgroundImage = "url('" + pui.normalizeURL(td.optionImage, true) + "')";
        }
        // Set the background-repeat style on the cell if the "background repeat"
        // property was set. Otherwise, allow CSS to handle it.
        if( me.repeat != null && me.repeat.length > 0){
          td.style.backgroundRepeat = me.repeat;
          if (me.repeat == "no-repeat") {
            td.style.backgroundPosition = "left center";
          }
        }
      }
      else {
        // Do not allow the background-image property to be set.
        td.style.backgroundImage = "";
      }

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
      assignEvents(td);
      prevTR = tr;
    }
    container.appendChild(table);
    
    function assignEvents(td) {
      td.oncontextmenu = function() { return false; }; 
      td.onmouseover = function() {
        td.animationDone = true;
        if (me.hoverBackgroundColor != null && me.hoverBackgroundColor != "") {
          td.style.backgroundColor = me.hoverBackgroundColor;
        }
        else{
          // Set the class so a user can define custom style (when bg color isn't set).
          td.className = "menu-hover";
        }

        if (me.hoverTextColor != null && me.hoverTextColor != "") td.style.color = me.hoverTextColor;
        // If hover-image property is set, then set it as inline BG image.
        if (me.optionHoverImage != null && me.optionHoverImage != "") {
          td.style.backgroundImage = "url('" + me.optionHoverImage + "')";
          // Set the background-repeat style on the cell if the "background repeat"
          // property was set. Otherwise, allow CSS to handle it.
          if( me.repeat != null && me.repeat.length > 0){
            td.style.backgroundRepeat = me.repeat;
            if (me.repeat == "no-repeat") {
              td.style.backgroundPosition = "left center";
            }
          }
        }
        else {
          if (td.optionImage != null && td.optionImage != "") {
            td.style.backgroundImage = "url('" + td.optionImage + "')";
          }
          else {
            td.style.backgroundImage = "";
          }
        }
        removeSameOrHigherLevelMenus(td);
        me.showSubMenu(td);
      };
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
            // if the customer added their own html in the options
            if (!keep) {
              var nextElmTable = getParentTable(tgt);
              var curElmTable = getParentTable(td);
              if (nextElmTable && nextElmTable === curElmTable ) keep = true;
            }
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
        // If option-image property was set, restore the background to it.
        if (td.optionImage != null && td.optionImage != "") {
          td.style.backgroundImage = "url('" + td.optionImage + "')";
          td.style.backgroundRepeat = me.repeat;
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
              setTimeout(function() { animate(opacity); }, 60);
            }
            animate(100);
          }
          else {
            td.style.backgroundColor = "";
          }
        }
        else {
          //when bg color isn't set, clear class. (for potential custom css).
          td.className = "";
        }

      };
      
      // Allow touch-to-click on HTML elements inside the TD: catch the event bubbling up to the TD on mobile. #5786.
      if (pui["is_touch"] && !pui["is_mouse_capable"] && td.children.length > 0){
        //Note: touchend is non-standard as of 12/5/19 but is a recommended spec. ontouchstart is less supported than adding the event listener.
        td.addEventListener("touchend", itemChosen, false);
      }
      else {
        // Normally a mouse button fires click. Mobile devices emulate a mouse by firing click only when onclick is registered on the target element.
        td.onclick = itemChosen;
      }

      // Allow editing of a top-menu value by double-clicking.
      td.ondblclick = function(e) {
        var isDesign = inDesignMode();
        if (isDesign && td.orientation == "vertical" && td.level == 0) {
          var dom = designUtils.getTarget(e);
          var itmDom = dom.parentNode;
          while (itmDom.tagName != "DIV") {
            itmDom = itmDom.parentNode;
          }
          var itm = toolbar.designer.getDesignItemByDomObj(itmDom);
          // Add an inline editor if the field isn't bound, translated,
          // and if the edited choice can be determined.
          if (!pui.isBound(itm.properties["choices"])
          && !pui.isTranslated(itm.properties["choices"])
          && typeof(dom.choiceNum) === "number" ) {
            itm.designer.inlineEditBox.onUpdate = function(newName) {
              var propValue = itm.properties["choices"];
              if (propValue == "") propValue = "Option 1,Option 2,Option 3";
              var optionNames = propValue.split(",");
              optionNames[dom.choiceNum] = newName;
              propValue = optionNames.join(",");
              var nmodel = getPropertiesNamedModel();
              var propConfig = nmodel["choices"];
              itm.designer.undo.add(itm, propConfig.name);
              applyPropertyToField(propConfig, itm.properties, itm.dom, propValue, true, itm, null);
              itm.propertiesChanged["choices"] = true;
              itm.changed = true;
              itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
              itm.designer.propWindow.refreshProperty("choices");
            };
            itm.designer.inlineEditBox.show(itm, dom, "menu");
          }
        }
      };
      function itemChosen() {
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
    }
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

  function getParentTable(elm) {
    var parent = elm;
    while (parent) {
      if (parent.tagName == 'TABLE') {
        return parent;
      }
      parent = parent.parentElement;
    }
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
    // Use timeout to avoid unnecessary, repeated drawing when multiple
    // properties are set.
    if( me.renderTimeout > 0 ) clearTimeout(me.renderTimeout);
    me.renderTimeout = setTimeout(function(){
      
      drawMenu({
        container: me.container,
        orientation: me.orientation,
        from: 0,
        to: me.choices.length - 1
      });

      me.renderTimeout = null;
      try{ delete me.renderTimeout;}catch(exc){}
    }, 0);
  };
  
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
      var destStyle = td.subMenuContainer.style;
      var sourceStyle = parentContainer.style;
      destStyle.backgroundColor = sourceStyle.backgroundColor;
      destStyle.letterSpacing = sourceStyle.letterSpacing;
      destStyle.wordSpacing = sourceStyle.wordSpacing;
      destStyle.textAlign = sourceStyle.textAlign;
      destStyle.textDecoration = sourceStyle.textDecoration;
      destStyle.textTransform = sourceStyle.textTransform;
      destStyle.fontVariant = sourceStyle.fontVariant;
      destStyle.fontWeight = sourceStyle.fontWeight;
      destStyle.fontSize = sourceStyle.fontSize;
      destStyle.fontFamily = sourceStyle.fontFamily;
      destStyle.color = sourceStyle.color;
      destStyle.zIndex = sourceStyle.zIndex;
      destStyle.position = "absolute";
      if(!pui.iPadEmulation) destStyle.cursor = sourceStyle.cursor;
      me.container.parentNode.appendChild(td.subMenuContainer);
    }
    if (td.orientation == "vertical") {
      td.subMenuContainer.style.top = (parentContainer.offsetTop + td.offsetTop) + "px";
      // If the menu has a scrollbar, then make sure the submenu is over it so it can be hovered over. #5266, 5583.
      var sbWidth = parentContainer.offsetWidth - parentContainer.clientWidth;
      td.subMenuContainer.style.left = (parentContainer.offsetLeft + parentContainer.offsetWidth - 1 - sbWidth) + "px";
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
  };
  
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
  };
  
  this.removeAllSubMenus = function() {
    var toRemove = [];
    for (var i = 0; i < displayedSubMenus.length; i++) {
      toRemove.push(displayedSubMenus[i]);
    }
    for (var i = 0; i < toRemove.length; i++) {
      me.removeSubMenu(toRemove[i]);
    }  
  };
  
};




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
      parms.dom.menuWidget = new pui.MenuWidget();
      var choices = parms.evalProperty("choices");
      if (choices != null && choices != "") {
        parms.dom.menuWidget.choices = pui.parseCommaSeparatedList(choices);
      }
      else {
        parms.dom.menuWidget.choices = ["Option 1", "Option 2", "Option 3"];
      }
      
      if (pui["onoptionclick value is text"] !== true){   // Disables fix for 4695, for issue 5336.
        var choiceValues = parms.evalProperty("choice values");
        if (choiceValues != null && choiceValues != ""){
          //If the customer has applied "choice values" property before this, then use those. #4695.
          parms.dom.menuWidget.choiceValues = pui.parseCommaSeparatedList(choiceValues);
        }
        else {
          parms.dom.menuWidget.choiceValues = [];
        }
      }
      
      parms.dom.menuWidget.container = parms.dom;
      parms.dom.menuWidget.hoverTextColor = parms.properties["hover text color"];
      parms.dom.menuWidget.hoverBackgroundColor = parms.properties["hover background color"];
      parms.dom.menuWidget.borderColor = parms.properties["border color"];
      parms.dom.menuWidget.optionImage = parms.properties["option image"];
      if (parms.dom.menuWidget.optionImage == null || parms.dom.menuWidget.optionImage == "") {
        parms.dom.menuWidget.optionImages = [];
      }
      else {
        parms.dom.menuWidget.optionImages = pui.parseCommaSeparatedList(parms.dom.menuWidget.optionImage);
      }
      parms.dom.menuWidget.optionHoverImage = parms.properties["option hover image"];
      //Note: this is confusing; setting "background image" does nothing because
      //"option image" controls it. But "background repeat" does take effect.
      parms.dom.menuWidget.repeat = parms.properties["background repeat"];
      parms.dom.menuWidget.padding = parms.properties["menu option padding"];
      parms.dom.menuWidget.paddingLeft = parms.properties["menu option indent"];
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

    // This property sets the table cell padding top/right/bottom.
    // CSS takes over if value is null.
    "menu option padding": function(parms) {
      if (parms.dom.menuWidget != null) {
        parms.dom.menuWidget.padding = parms.value;
        parms.dom.menuWidget.draw();
      }
    },

    // This property set the table cell padding-left style.
    // CSS takes over if value is null.
    "menu option indent": function(parms) {
      if (parms.dom.menuWidget != null) {
        parms.dom.menuWidget.paddingLeft = parms.value;        
        parms.dom.menuWidget.draw();
      }
    },

    "option image": function(parms) {
      if (parms.dom.menuWidget != null) {
        parms.dom.menuWidget.optionImage = parms.value;
        if (parms.value == null || parms.value == "") {
          parms.dom.menuWidget.optionImages = [];
        }
        else {
          parms.dom.menuWidget.optionImages = pui.parseCommaSeparatedList(parms.value);
        }
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
          parms.dom.menuWidget.draw();
        }
        break;
    }
  }
  
});
