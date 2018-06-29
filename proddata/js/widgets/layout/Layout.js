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
  this.centerHor = false;
  this.centerVert = false;
  
  var me = this;
  
  function sizeContainer(container) {
    for (var j = 0; j < container.childNodes.length; j++) {
      var child = container.childNodes[j];
      if (child.layout != null) {
        child.layout.stretch();
        if (child.layout.iScroll != null) child.layout.iScroll["refresh"]();
      }
      if (child.sizeMe != null && typeof child.sizeMe == "function") {
        if (pui.isPercent(child.style.width) || pui.isPercent(child.style.height) || child.grid != null) {
          child.sizeMe();
        }
      }
      if (child.positionMe != null && typeof child.positionMe == "function")
        child.positionMe(); 
    }
  }
  
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
    };
  };
  
  this.hasChildren = function() {
    var containers = pui.layout.template.getContainers(me.layoutDiv);
    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      if (container.firstChild != null) return true;
    }
    return false;
  };

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
  };
  
  this.setPropertiesModel = function() {
    me.layoutDiv.propertiesModel = pui.layout.getProperties(me.template);
    me.layoutDiv.propertiesNamedModel = makeNamedModel(me.layoutDiv.propertiesModel);
  };
 
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
      me.containers = rv.containers;
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
  };

  this.updatePropertyInDesigner = function(propertyName, value) {
    if (!me.designMode) return false;
    var itm = me.designItem;
    if (itm.properties[propertyName] != value) {
      if (pui.isBound(itm.properties[propertyName])) {
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
  };

  this.stretch = function() {
    var dims = [];
    for (var i = 0; i < me.stretchList.length; i++) {
      var container = me.stretchList[i];
      container.style.width = "";
      container.style.height = "";
      //For Android, don't hide the container while it is resizing. Issue 2512.
      if(!pui["is_android"]) container.style.display = "none";
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
      // In design mode, we accommodate to be able to show the layout border, etc. At runtime, the calculation is more exact.
      dim.width -= (me.designMode ? 4 : 2);
      if (dim.width < 0) dim.width = 0;
      dim.height -= (me.designMode ? 4 : 2);
      if (dim.height < 0) dim.height = 0;
      container.style.width = dim.width + "px";
      container.style.height = dim.height + "px";
      container.style.display = "";
    }
    me.sizeContainers();
    me.center();
  };
  
  this.sizeContainers = function() {
    for (var i = 0; i < me.containers.length; i++) {
      sizeContainer(me.containers[i]);
    }
  };
  
  this.center = function() {
    var hor = me.centerHor;
    var vert = me.centerVert;
    if (!hor && !vert) return;

    var size = {};
    var parentIsBrowserWindow = false;
    var parent = me.layoutDiv.parentNode;
    if ( parent != null && parent.tagName == "DIV" &&
         parent.offsetWidth > 0 &&
         (parent.parentNode != document.body || (parent.style.width != null && parent.style.height != null && parent.style.width != "" && parent.style.height != "")) ) {
      size.width = parent.offsetWidth;
      size.height = parent.offsetHeight;
    }
    else {
      var windowSize = pui["getWindowSize"]();
      size.width = windowSize["width"];
      size.height = windowSize["height"];
      parentIsBrowserWindow = true;
    }

    if (hor) {
      var layoutLeft = parseInt((size.width - me.layoutDiv.offsetWidth) / 2);
      if (layoutLeft < 0) {
        if (parentIsBrowserWindow) document.body.scrollLeft = Math.abs(layoutLeft);
        layoutLeft = 0;
      }
      me.layoutDiv.style.left = layoutLeft + "px";
    }

    if (vert) {
      var layoutTop = parseInt((size.height - me.layoutDiv.offsetHeight) / 2);
      if (layoutTop < 0) {
        layoutTop = 0;
      }    
      me.layoutDiv.style.top = layoutTop + "px";
    }
  };

  this.setProperty = function(property, value) {
    if (value == null) value = "";
    var panel = me.layoutDiv.panel;
    var accordion = me.layoutDiv.accordion;
    var responsivelayout = me.layoutDiv.responsivelayout;
    var tabLayout = me.layoutDiv.tabLayout;
    
    switch (property) {
      case "id":
        me.layoutDiv.id = value;
        if (responsivelayout != null){
          //The responsive layout's embedded styles can use the widget's ID. So these must be refreshed.
          responsivelayout.setRules();
        }
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
          if (panel) panel.resize();
          if (accordion) accordion.resize();
          if (responsivelayout) responsivelayout.resize();
          if (tabLayout) tabLayout.resize();
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
        if (panel != null) panel.resize();
        if (accordion != null) accordion.resize();
        if (responsivelayout != null) responsivelayout.resize();
        if (tabLayout != null) tabLayout.resize();
        me.stretch();
        
        // To allow inline-style setting and removing, cache the style property.
        if (me.designMode) {
          if( value.length == 0 )
            pui.removeCachedStyle(me.layoutDiv, styleName);
          else
            pui.cacheStyle(me.layoutDiv, styleName, value );
        }
        break;

      case "z index":
        me.layoutDiv.style.zIndex = value;
        
        // To allow inline-style setting and removing, cache the style property.
        if (me.designMode) {
          if( value.length == 0 )
            pui.removeCachedStyle(me.layoutDiv, "z-index");
          else
            pui.cacheStyle(me.layoutDiv, "z-index", value );
        }
        break;

      case "center horizontally":
        if (!me.designMode) me.centerHor = (value == "true" || value == true);
        break;

      case "center vertically":
        if (!me.designMode) me.centerVert = (value == "true" || value == true);
        break;

      case "locked in place":
        me.lockedInPlace = (value == "true" || value == true);
        break;

      case "css class":
        break;
        
      case "overflow x":
        me.layoutDiv.firstChild.style.overflowX = value;
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
              pui.scriptError(err, property.substr(0,1).toUpperCase() + property.substr(1) + " Error:\n");        
            }
          };
          me.layoutDiv[property] = func;
        }
        break;

      case "has header":
        if (panel != null) panel.setHasHeader(value != "false" && value != false);
        me.templateProps[property] = value;
        break;

      case "small sections":
        if (accordion != null) accordion.setMini(value == "true" || value == true);
        me.templateProps[property] = value;
        break;

      case "allow collapse":
        if (accordion != null) accordion.setAllowCollapse(value);
        me.templateProps[property] = value;
        break;

      case "header height":
        if (panel != null) panel.setHeaderHeight(value);
        me.templateProps[property] = value;
        break;

      case "header text":
        if (panel != null) panel.setText(value);
        me.templateProps[property] = value;
        break;

      case "header theme":
        if (panel != null) panel.setHeaderSwatch(value);
        if (accordion != null) accordion.setHeaderSwatch(value);
        me.templateProps[property] = value;
        break;

      case "body theme":
        if (panel != null) panel.setBodySwatch(value);
        if (accordion != null) accordion.setBodySwatch(value);
        me.templateProps[property] = value;
        break;

      case "straight edge":
        if (panel != null) panel.setStraightEdge(value);
        if (accordion != null) accordion.setStraightEdge(value);
        me.templateProps[property] = value;
        break;

      case "color":
      case "font family":
      case "font size":
      case "font style":
      case "font weight":
      case "text align":
      case "text decoration":
      case "text transform":
        if (panel != null) panel.setStyle(property, value);
        if (accordion != null) {
          accordion.setStyle(property, value);
          if (property == "font family" || property == "font size") {
            accordion.resize();
          }
        }
        if (tabLayout != null) {
          tabLayout.setStyle(property, value);
        }
        me.templateProps[property] = value;
        break;
      
      case "onsectionclick":
        if (!me.designMode) {
           me.layoutDiv[property + "event"] = function() {
            eval("var section = arguments[0];");
            try {
              return eval(value);
            }
            catch(err) {
              pui.scriptError(err, "Onexpand Error:\n");
            }
          };
        }
        break;

      
      default: 
        var savedValue = me.templateProps[property];
        me.templateProps[property] = value;
        if (me.designMode && !toolbar.loadingDisplay && !toolbar.pastingFormat) {
          var rv = me.applyTemplate();
          if (me.layoutDiv.accordion != null) me.layoutDiv.accordion.resize();
          if (rv.success == false) {
            me.templateProps[property] = savedValue;
            setTimeout(function() {
              me.updatePropertyInDesigner(property, savedValue);
            }, 0);
          }
        }
        break;  
    }
  };
  
  this.applyScrolling = function() {
    function setupiScroll() {
      var parent = me.layoutDiv.parentNode;
      if (parent != null && parent.tagName == "DIV") {
        if (pui["is_ios"]) {
          document.body.addEventListener('tap', function (e) {
            e["preventDefault"]();
            e["stopPropagation"]();
            e["stopImmediatePropagation"]();
            var event = new MouseEvent('click',{
              view: window,
              bubbles: true,
              cancelable: true
            })
            var target = getTarget(e);
            if (target) {
              if (!/^(INPUT|TEXTAREA|BUTTON|SELECT|IMG)$/.test(target.tagName)) {
                setTimeout(function() {
                  var isCanceled = target.dispatchEvent(event);
                  if (!isCanceled) {
                    event["preventDefault"]();
                    event["stopPropagation"]();
                  }
                },10);
              }
            } 
          }, false);
        }
        var config = {
          "scrollbars": true,
          "mouseWheel": true,
          "shrink": true,
          "tap": pui["is_ios"],
          "disableMouse": pui["is_ios"],
          "preventDefaultException": {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|IMG)$/
          },
          "onBeforeScrollStart": function (e) {
            var target = getTarget(e);
            while (target.nodeType != 1) target = target.parentNode;
            while (target.tagName == "SPAN") target = target.parentNode;
            if (target.tagName != "SELECT" && target.tagName != "INPUT" && target.tagName != "TEXTAREA" && target.tagName != "A") {
              e.preventDefault();
            }
          }
        };
        if (typeof IScroll == "function") me.iScroll = new IScroll(parent, config);  // new version
        else me.iScroll = new iScroll(parent, config);  // old version
      }
    }
    
    var counter = 0;
    
    function keepTryingToSetupiScroll() {
      counter++;
      if (counter > 100) {  // give up
        return;
      }
      setTimeout(function() {
        if (typeof IScroll == "function" || typeof iScroll == "function") {  // as of version 5, the class name is IScroll (used to be iScroll)
          setupiScroll();
        }
        else {
          keepTryingToSetupiScroll();
        }        
      }, 200);
    }
  
    if (typeof IScroll == "function" || typeof iScroll == "function") {  // as of version 5, the class name is IScroll (used to be iScroll)
      setupiScroll();
    }
    else {
      var returnValue = pui["loadJS"]({
        "path": pui.normalizeURL("/iscroll/iscroll.js"),
        "callback": function() {
          setupiScroll();
        }
      });
      if (returnValue == false) {
        keepTryingToSetupiScroll();
      }
    }      
  };

  this.onresize = function() {
    if (me.assignHeightOnResize == true) {
      var orientation = window["orientation"];
      var height = window["screen"]["width"];  // assume landscape
      if (orientation == 0 || orientation == 180) {  // test for portrait
        height = window["screen"]["height"];
      }
      height -= 18;  // account for status bar
      height += "px";
      me.layoutDiv.parentNode.style.height = height;
      document.body.style.height = height;
      document.body.parentNode.style.height = height;
      me.layoutDiv.style.height = height;
      me.setProperty("height", height);
    }
    me.stretch();
  };
  
  
  this.destroy = function() {
    removeEvent(window, "resize", me.onresize);
    removeEvent(document, "orientationchange", me.onresize);
    if (me.iScroll != null) {
      me.iScroll["destroy"]();
      me.iScroll = null;
      delete me.iScroll;
    }
    me.layoutDiv = null;
    me.templateProps = null;
    me.stretchList = null;
    me = null;
  };
  
};