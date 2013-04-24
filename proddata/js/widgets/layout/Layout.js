//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2013 Profound Logic Software, Inc.
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
 * Layout Class
 * @constructor
 */

pui.layout.Layout = function() {

  this.layoutDiv = null;
  this.designMode = false;
  this.template = "test";
  this.templateProps = {};
  this.lockedInPlace = false;
  this.stretchList = [];
  this.containers = [];
  
  var me = this;
  
  this.enableDesign = function() {
    me.designMode = true;
    me.layoutDiv.destroy = me.destroy;
    me.layoutDiv.onclick = function(e) {
      if (me.lockedInPlace) {
        var target = getTarget(e);
        if (target == me.layoutDiv || (target.getAttribute != null && target.getAttribute("container") == "true")) {  // make sure we're not clicking on a widget inside the layout
          // select the layout
          var itm = me.designItem;
          if (itm == null) return;
          var selection = itm.designer.selection;
          if (selection.resizers.length == 1 && selection.resizers[0].designItem == itm) return;
          selection.clear();
          selection.add(itm);
          itm.designer.propWindow.refresh();
        }
      }
    }
  }
  
  this.hasChildren = function() {
    var containers = pui.layout.template.getContainers(me.layoutDiv);
    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      if (container.firstChild != null) return true;
    }
    return false;
  }

  this.getChildren = function(parms) {
    if (parms == null) parms = {};
    parms.hasTabPanels = false;
    parms.hasFieldSets = false;
    var children = [];
    var designer = me.layoutDiv.designItem.designer;
    var items = designer.items;
    for (var i = 0; i < items.length; i++) {
      var itm = items[i];
      if (itm.getParentLayout() == me) {
        if (itm.properties["field type"] == "tab panel") parms.hasTabPanels = true;
        if (itm.properties["field type"] == "field set panel") parms.hasFieldSets = true;
        children.push(itm);
      }
    }
    return children;
  }
  
  this.setPropertiesModel = function() {
    me.layoutDiv.propertiesModel = pui.layout.getProperties(me.template);
    me.layoutDiv.propertiesNamedModel = makeNamedModel(me.layoutDiv.propertiesModel);
  }
 
  this.applyTemplate = function() {
    var parms = {
      dom: me.layoutDiv,
      template: me.template,
      properties: me.templateProps,
      designMode: me.designMode
    };
    var rv = pui.layout.template.applyTemplate(parms);
    if (rv.success) {
      me.stretchList = rv.stretchList;
      me.stretch();
    }
    else {
      setTimeout(function() {
        pui.alert(rv.msg);
      }, 0);
      return rv;
    }
    me.setPropertiesModel();
    return rv;
  }

  this.updatePropertyInDesigner = function(propertyName, value) {
    if (!me.designMode) return false;
    var itm = me.designItem;
    if (itm.properties[propertyName] != value) {
      if (typeof itm.properties[propertyName] == "object") {
        itm.properties[propertyName].designValue = value;
      }
      else {
        itm.properties[propertyName] = value;
      }
      itm.propertiesChanged[propertyName] = true;
      itm.changed = true;
      itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
      itm.designer.propWindow.refresh();
      return true;
    }
    return false;
  }  

  this.stretch = function() {
    var dims = [];
    for (var i = 0; i < me.stretchList.length; i++) {
      var container = me.stretchList[i];
      container.style.width = "";
      container.style.height = "";
      container.style.display = "none";
    }
    for (var i = 0; i < me.stretchList.length; i++) {
      var container = me.stretchList[i];
      var parent = container.parentNode;
      dims.push({
        width: parent.offsetWidth,
        height: parent.offsetHeight
      });
    }
    for (var i = 0; i < me.stretchList.length; i++) {
      var container = me.stretchList[i];
      var dim = dims[i];
      dim.width -= 4;
      if (dim.width < 0) dim.width = 0;
      dim.height -= 4;
      if (dim.height < 0) dim.height = 0;
      container.style.width = dim.width + "px";
      container.style.height = dim.height + "px";
      container.style.display = "";
      for (j = 0; j < container.childNodes.length; j++) {
        var child = container.childNodes[j];
        if (child.sizeMe != null && typeof child.sizeMe == "function") {
          if (pui.isPercent(child.style.width) || pui.isPercent(child.style.height) || child.grid != null) {
            child.sizeMe();
          }
        }
      }
    }
  }

  this.setProperty = function(property, value) {
    if (value == null) value = "";
    
    switch (property) {
      case "id":
        me.layoutDiv.id = value;
        break;
      
      case "field type":
        break;
      
      case "template":
        if (me.designMode) {
          me.designItem.properties["template"] = value;
          me.designItem.propertiesChanged["template"] = true;
          me.designItem.changed = true;
          me.designItem.designer.changedScreens[me.designItem.designer.currentScreen.screenId] = true;
          me.designItem.designer.propWindow.refresh();
        }
        break;

      case "left":
      case "top":
      case "right":
      case "bottom":
        me.layoutDiv.style[property] = value;
        break;
        
      case "height":
      case "width":
      case "min height":
      case "min width":
      case "max height":
      case "max width":
        var words = property.split(" ");
        var styleName = property;
        if (words.length > 1) {
          styleName = words[0] + words[1].substr(0, 1).toUpperCase() + words[1].substr(1);
        }
        me.layoutDiv.style[styleName] = value;
        me.stretch();
        break;

      case "z index":
        me.layoutDiv.style.zIndex = value;
        break;

      case "locked in place":
        me.lockedInPlace = (value == "true" || value == true);
        break;

      case "css class":
        break;
        
      case "tool tip":
        me.layoutDiv.title = value;
        break;

      case "visibility":
        if (!me.designMode) {
          me.layoutDiv.style.visibility = value;
        }
        if (me.designMode) {
          if (value == "hidden") {
            me.layoutDiv.style.filter = "alpha(opacity=30)";
            me.layoutDiv.style.opacity = 0.30;
          }
          else {
            me.layoutDiv.style.filter = "";
            me.layoutDiv.style.opacity = "";
          }
        }
        break;
 
      case "onclick":
      case "ondblclick":
      case "onmousedown":
      case "onmousemove":
      case "onmouseout":
      case "onmouseover":
      case "onmouseup":
        if (!me.designMode) {
          var func = function(e) {
            try {
              var customFunction = eval(value);
              if (typeof customFunction == "function") {
                if (!e) e = window.event;
                customFunction(e, this);
              }
            }
            catch(err) {
              pui.alert(property.substr(0,1).toUpperCase() + property.substr(1) + " Error:\n" + err.message);        
            }
          }
          me.layoutDiv[property] = func;
        }
        break;
      
      default: 
        var savedValue = me.templateProps[property];
        me.templateProps[property] = value;
        if (me.designMode && !toolbar.loadingDisplay && !toolbar.pastingFormat) {
          var rv = me.applyTemplate();
          if (rv.success == false) {
            me.templateProps[property] = savedValue;
            setTimeout(function() {
              me.updatePropertyInDesigner(property, savedValue);
            }, 0);
          }
        }
        break;
      
    }
  }
  
  this.applyScrolling = function() {
    function setupiScroll() {
      var parent = me.layoutDiv.parentNode;
      if (parent != null && parent.tagName == "DIV") {
        me.iScroll = new iScroll(parent);
      }
    }
  
    if (typeof iScroll == "function") {    
      setupiScroll();
    }
    else {
      pui["loadJS"]({
        "path": "/iscroll/iscroll.js",
        "test": function() {
          return (typeof iScroll == "function");
        },
        "callback": function() {
          setupiScroll();
        }
      });
    }      
  }
  
  this.destroy = function() {
    removeEvent(window, "resize", me.stretch);
    if (me.iScroll != null) {
      me.iScroll.destroy();
      me.iScroll = null;
      delete me.iScroll;
    }
    me.layoutDiv = null;
    me.templateProps = null;
    me.stretchList = null;
    me = null;
  }
  
}