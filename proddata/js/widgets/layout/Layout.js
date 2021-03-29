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
 * Layout Class
 * @constructor
 */

pui.layout.Layout = function() {
  
  // Public
  this.layoutDiv = null;
  this.designMode = false;
  this.template = "test";
  this.templateProps = {};
  this.lockedInPlace = false;
  this.stretchList = [];
  this.containers = [];
  this.centerHor = false;
  this.centerVert = false;
  this.assignHeightOnResize = false;  //Should only be true if this layout is the top, has height 100%, in runtime, and is cordova+iOS.
    
  // Flags for each container to avoid redundant resizing of children on tab/section change when this layout has not resized.
  this.childrenSized = {};
  
  // When a lazy-loaded container is rendered, onlazyload script runs.
  this.onlazyload = null;
  
  // Private.

  // Lazy-loading
  this._renderParms = null;
  this._lazyChildren = {}; //Properties to render child items later. Keys: container numbers; values: arrays of properties objects.  
};
pui.layout.Layout.prototype = Object.create(pui.BaseClass.prototype);

/**
 * 
 */
pui.layout.Layout.prototype.enableDesign = function() {
  this.designMode = true;
  this.layoutDiv.destroy = this.destroy.bind(this);
  this.layoutDiv.addEventListener('click', this); 
};

/**
 * In Design mode, the user clicked the layout Div.
 * @param {MouseEvent} e
 */
pui.layout.Layout.prototype._designOnClick = function(e){
  if (this.lockedInPlace) {
    if (pui.designer.skipLayoutClick) return;
    var target = getTarget(e);
    if (target == this.layoutDiv || 
        (target.getAttribute != null && 
         target.getAttribute("container") == "true" &&
         pui.layout.template.getContainers(this.layoutDiv).includes(target)
        )
       ) {  // make sure we're not clicking on a widget inside the layout
      // select the layout
      var itm = this.designItem;
      if (itm == null) return;
      var selection = itm.designer.selection;
      if (selection.resizers.length == 1 && selection.resizers[0].designItem == itm) return;
      selection.clear();
      selection.add(itm);
      itm.designer.propWindow.refresh();
    }
  }
};

pui.layout.Layout.prototype.hasChildren = function() {
  var containers = pui.layout.template.getContainers(this.layoutDiv);
  for (var i = 0; i < containers.length; i++) {
    var container = containers[i];
    if (container.firstChild != null) return true;
  }
  return false;
};

/**
 * 
 * @param {Object} parms
 * @returns {Array}
 */
pui.layout.Layout.prototype.getChildren = function(parms) {
  if (parms == null) parms = {};
  parms.hasTabPanels = false;
  parms.hasFieldSets = false;
  var children = [];
  var designer = this.layoutDiv.designItem.designer;
  var items = designer.items;
  for (var i = 0; i < items.length; i++) {
    var itm = items[i];
    if (itm.getParentLayout() == this) {
      if (itm.properties["field type"] == "tab panel") parms.hasTabPanels = true;
      if (itm.properties["field type"] == "field set panel") parms.hasFieldSets = true;
      children.push(itm);
    }
  }
  return children;
};

pui.layout.Layout.prototype.setPropertiesModel = function() {
  this.layoutDiv.propertiesModel = pui.layout.getProperties(this.template);
  this.layoutDiv.propertiesNamedModel = makeNamedModel(this.layoutDiv.propertiesModel);
};

pui.layout.Layout.prototype.applyTemplate = function() {
  var parms = {
    dom: this.layoutDiv,
    template: this.template,
    properties: this.templateProps,
    designMode: this.designMode
  };
  var rv = pui.layout.template.applyTemplate(parms);
  if (rv.success) {
    this.stretchList = rv.stretchList;
    this.containers = rv.containers;
    this.stretch();
  }
  else {
    setTimeout(function() {
      pui.alert(rv.msg);
    }, 0);
    return rv;
  }
  this.setPropertiesModel();
  return rv;
};

/**
 * Change a property value of the design item associated with this layout and refresh the property window.
 * @param {String} propertyName
 * @param {String} value
 * @returns {Boolean}
 */
pui.layout.Layout.prototype.updatePropertyInDesigner = function(propertyName, value) {
  if (!this.designMode) return false;
  var itm = this.designItem;
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

/**
 * Expand container in this layout that has a "stretch" attribute, and recursively call resize on child layouts and sizeMe on their contents.
 * Pre-conditions: this.resize should have run to size this layout, if necessary.
 */
pui.layout.Layout.prototype.stretch = function() {
  var dims = [];
  for (var i = 0; i < this.stretchList.length; i++) {
    var container = this.stretchList[i];
    container.style.width = "";
    container.style.height = "";
    //For Android, don't hide the container while it is resizing. Issue 2512.
    if(!pui["is_android"]) container.style.display = "none";
  }
  for (var i = 0; i < this.stretchList.length; i++) {
    var container = this.stretchList[i];
    var parent = container.parentNode;
    dims.push({
      width: parent.offsetWidth,
      height: parent.offsetHeight
    });
  }
  for (var i = 0; i < this.stretchList.length; i++) {
    var container = this.stretchList[i];
    var dim = dims[i];
    var overflowX = parent.style.overflowX;
    var overflowY = parent.style.overflowY;
    // In design mode, we accommodate to be able to show the layout border, etc. At runtime, the calculation is more exact.
    dim.width -= ((this.designMode && this.template !== 'mobile device' || overflowX === 'auto' || overflowX === 'scroll' || this.template == "table") ? 4 : 2);
    if (dim.width < 0) dim.width = 0;
    dim.height -= ((this.designMode && this.template !== 'mobile device' || overflowY === 'auto' || overflowY === 'scroll' || this.template == "table") ? 4 : 2);
    if (dim.height < 0) dim.height = 0;
    container.style.width = dim.width + "px";
    container.style.height = dim.height + "px";
    container.style.display = "";
  }
  this.sizeContainers();
  this.center();
  
  var iScroll = this.iScroll;
  if (iScroll != null) iScroll["refresh"]();
};

/**
 * Check each container for child widgets that need adjustments depending on container sizes and visibility.
 * @param {Number|undefined} visidx    When set, is index of newly visible container, and children of this container should resize.
 */
pui.layout.Layout.prototype.sizeContainers = function( visidx ) {
  // The parameter didn't provide a container index, so fetch it. (sizeContainers may be in a recursive resize.)
  if (typeof visidx !== 'number') visidx = this.getVisibleContainerIndex();

  var containers = this.containers;
  var container = containers[visidx];
  if (container != null){
    // The template has an active container, so size that one's children.
    pui.resizeChildrenOf(container, true);
    this.childrenSized[visidx] = true;
  }
  else {
    // Assume the layout hides no containers, so resize all.
    for (var i=0, n=containers.length; i < n && (container = containers[i]); i++) {
      pui.resizeChildrenOf(container, true);
      this.childrenSized[i] = true;
    }
  }
};

/**
 * 
 */
pui.layout.Layout.prototype.center = function() {
  var hor = this.centerHor;
  var vert = this.centerVert;

  // Trigger centering logic in design mode
  if (this.designMode && this.designItem) {
    var item = this.designItem;
    var centerHorizontally = null;
    if (item.propertiesChanged["center horizontally"]) centerHorizontally = item.properties["center horizontally"];
    if (centerHorizontally === "true") {
      var halfWidth = parseInt(this.layoutDiv.offsetWidth / 2);
      if (!isNaN(halfWidth) && halfWidth > 0) {
        this.layoutDiv.style.left = "calc(50% - " + halfWidth + "px)";
        var resizer = item.getResizer();
        if (resizer) resizer.positionSizies();
      }
    }
  }

  // Runtime processing
  if (!hor && !vert) return;

  var size = {};
  var parentIsBrowserWindow = false;
  var parent = this.layoutDiv.parentNode;
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
    var layoutLeft = parseInt((size.width - this.layoutDiv.offsetWidth) / 2);
    if (layoutLeft < 0) {
      if (parentIsBrowserWindow) document.body.scrollLeft = Math.abs(layoutLeft);
      layoutLeft = 0;
    }
    this.layoutDiv.style.left = layoutLeft + "px";
  }

  if (vert) {
    var layoutTop = parseInt((size.height - this.layoutDiv.offsetHeight) / 2);
    if (layoutTop < 0) {
      layoutTop = 0;
    }    
    this.layoutDiv.style.top = layoutTop + "px";
  }
};

/**
 * Figure out which template type this layout contains, and call the method that sizes that template. Then stretch.
 * Note: resize may be called to size this layout for the first time.
 */
pui.layout.Layout.prototype.resize = function() {
  var div = this.layoutDiv;
  var panel = div.panel;
  var accordion = div.accordion;
  var layoutTClass = div.layoutT;
  
  if (panel) panel.resize();
  else if (accordion) accordion.resize(null, true);
  else if (layoutTClass) layoutTClass.resize();
  
  this.childrenSized = {};  //If this layout has been sized, then its children should also be when the tab/section becomes visible.
  
  this.stretch();
};

/**
 * Figure out which template type this layout contains, and get the active container for it. Needed in Templates that hide containers 
 * that their children are now visible: render should happen, or resize should happen to children.
 * @returns {Number}    Returns -1 if the layout does not hide sections.
 */
pui.layout.Layout.prototype.getVisibleContainerIndex = function(){
  var div = this.layoutDiv;
  var accordion = div.accordion;
  var layoutTClass = div.layoutT;
  
  var cont = -1;
  if (accordion) cont = accordion.getExpandedSection();
  else if (layoutTClass && layoutTClass.selectedTab != null) cont = parseInt(layoutTClass.selectedTab, 10);  //TabLayout
  
  return cont;
};

/**
 * A global property setter for layout widgets, called directly for some properties and at the end of layoutWidget.js global property setter.
 * @param {String} property
 * @param {String} value
 */
pui.layout.Layout.prototype.setProperty = function(property, value) {
  if (value == null) value = "";
  var panel = this.layoutDiv.panel;
  var accordion = this.layoutDiv.accordion;
  
  // If the layout template's class handles setting properties, then return. Those should prevent custom properties from re-loading 
  // the entire template when not defined here.  
  var layoutT = this.layoutDiv.layoutT;
  if (layoutT && layoutT.setProperty(property, value, this.templateProps)) return;

  switch (property) {
    case "id":
      this.layoutDiv.id = value;
      break;

    case "field type":
      break;

    case "template":
      if (this.designMode) {        
        this.designItem.properties["template"] = value;
        this.designItem.propertiesChanged["template"] = true;
        this.designItem.changed = true;
        this.designItem.designer.changedScreens[this.designItem.designer.currentScreen.screenId] = true;
        this.designItem.designer.propWindow.refresh();
        
        this.resize();
      }
      break;

    case "left":
    case "top":
    case "right":
    case "bottom":
      this.layoutDiv.style[property] = value;
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
      this.layoutDiv.style[styleName] = value;
      
      this.resize();

      // To allow inline-style setting and removing, cache the style property.
      if (this.designMode) {
        if( value.length == 0 )
          pui.removeCachedStyle(this.layoutDiv, styleName);
        else
          pui.cacheStyle(this.layoutDiv, styleName, value );
      }
      break;

    case "z index":
      this.layoutDiv.style.zIndex = value;

      // To allow inline-style setting and removing, cache the style property.
      if (this.designMode) {
        if( value.length == 0 )
          pui.removeCachedStyle(this.layoutDiv, "z-index");
        else
          pui.cacheStyle(this.layoutDiv, "z-index", value );
      }
      break;

    case "center horizontally":
      if (!this.designMode) this.centerHor = (value == "true" || value == true);
      break;

    case "center vertically":
      if (!this.designMode) this.centerVert = (value == "true" || value == true);
      break;

    case "locked in place":
      this.lockedInPlace = (value == "true" || value == true);
      break;

    case "css class":
      break;

    case "overflow x":
      this.layoutDiv.firstChild.style.overflowX = value;
      break;

    case "tool tip":
      this.layoutDiv.title = value;
      break;

    case "visibility":
      if (!this.designMode) {
        this.layoutDiv.style.visibility = value;
      }
      if (this.designMode) {
        if (value == "hidden") {
          this.layoutDiv.style.filter = "alpha(opacity=30)";
          this.layoutDiv.style.opacity = 0.30;
        }
        else {
          this.layoutDiv.style.filter = "";
          this.layoutDiv.style.opacity = "";
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
      // Note: this function seems to be overwritten in runtime by code in applyPropertyToField in runtime/properties.js around line 1898.
      if (!this.designMode) {
        var me = this;
        var func = function(e) {
          try {
            var customFunction = eval(value);
            if (typeof customFunction == "function") {
              customFunction(e, me);
            }
          }
          catch(err) {
            pui.scriptError(err, property.substr(0,1).toUpperCase() + property.substr(1) + " Error:\n");        
          }
        };
        this.layoutDiv[property] = func;
      }
      break;

    case "has header":
      if (panel != null) panel.setHasHeader(value != "false" && value != false);
      this.templateProps[property] = value;
      break;

    case "small sections":
      if (accordion != null) accordion.setMini(value == "true" || value == true);
      this.templateProps[property] = value;
      break;

    case "allow collapse":
      if (accordion != null) accordion.setAllowCollapse(value);
      this.templateProps[property] = value;
      break;

    case "header height":
      if (panel != null) panel.setHeaderHeight(value);
      this.templateProps[property] = value;
      break;

    case "header text":
      if (panel != null) panel.setText(value);
      this.templateProps[property] = value;
      break;

    case "header theme":
      if (panel != null) panel.setHeaderSwatch(value);
      if (accordion != null) accordion.setHeaderSwatch(value);
      this.templateProps[property] = value;
      break;

    case "body theme":
      if (panel != null) panel.setBodySwatch(value);
      if (accordion != null) accordion.setBodySwatch(value);
      this.templateProps[property] = value;
      break;

    case "straight edge":
      if (panel != null) panel.setStraightEdge(value);
      if (accordion != null) accordion.setStraightEdge(value);
      this.templateProps[property] = value;
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
      else if (accordion != null) {
        accordion.setStyle(property, value);
        if (property == "font family" || property == "font size") {
          accordion.resize();
        }
      }
      this.templateProps[property] = value;
      break;

    case "onsectionclick":
      if (!this.designMode) {
         this.layoutDiv[property + "event"] = function() {
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
      
    case 'lazy load':
      // Do nothing here; renderFormat handles this property. Catch this case to prevent applyTemplate from rebuilding unnecessarily.
      break;

    case "onlazyload":
      if (!this.designMode && typeof value == "string" && value.length > 0){
        this.onlazyload = value;
      }
      break;

    default:
      // For each property not previously handled the template is re-evaluated. Necessary for custom, HTML-declared ones.
      var savedValue = this.templateProps[property];
      this.templateProps[property] = value;
      if (this.designMode && !toolbar.loadingDisplay && !toolbar.pastingFormat) {
        var rv = this.applyTemplate();
        accordion = this.layoutDiv.accordion;
        if (accordion != null) accordion.resize();
        if (rv.success == false) {
          this.templateProps[property] = savedValue;
          var me = this;
          setTimeout(function() {
            me.updatePropertyInDesigner(property, savedValue);
          }, 0);
        }
      }
      break;  
  }
};

/**
 * If the layout's ID or className is "scroller", then applyScrolling is called to setup IScroll during the property setter initialize.
 */
pui.layout.Layout.prototype.applyScrolling = function() {
  var me = this;
  /**
   * setupiScroll can be called after iscroll.js is loaded and IScroll is a function.
   * Tests: make sure CSS buttons can be clicked when inside scrollers #4590. Make sure signature pads can be signed #6640.
   */
  function setupiScroll(){
    clearTimeout(setupiScroll_tmo);  //If the loadJS callback is called before the setTimout callback, then avoid duplicate calls.
    var parent = me.layoutDiv.parentNode;
    if (parent != null && parent.tagName == "DIV") {
      var config = {
        "scrollbars": true,
        "mouseWheel": true,
        "disableMouse": pui["is_ios"],
        "preventDefaultException": {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|IMG)$/
        }
      };
      me.iScroll = new IScroll(parent, config);
    }
  }

  var counter = 0;
  
  function keepTryingToSetupiScroll() {
    counter++;
    if (counter > 100) {  // give up
      return;
    }
    setupiScroll_tmo = setTimeout(function() {
      if (typeof IScroll == "function" || typeof iScroll == "function") {  // as of version 5, the class name is IScroll (used to be iScroll)
        setupiScroll();
      }
      else {
        keepTryingToSetupiScroll();
      }
    }, 200);
  }
  
  var setupiScroll_tmo = 0;
  if (typeof IScroll == "function" || typeof iScroll == "function") {  // as of version 5, the class name is IScroll (used to be iScroll)
    setupiScroll();
  }
  else {
    var returnValue = pui["loadJS"]({
      "path": pui.normalizeURL("/iscroll/iscroll.js"),
      "callback": setupiScroll
    });
    if (returnValue == false) {
      keepTryingToSetupiScroll();
    }
  }
};

/**
 * Assign heights to the document body, body parent, layout DIV, and layout parent.
 * Phonegap/Mobile Client is buggy on iOS when using 100% height, so we assign the height in pixels.  TODO: see if this is still necessary.
 * layoutWidget.js calls this; this should otherwise only be called in runtime for the top-most layout with 100% height, and for cordova+iOS.
 * @argument {undefined|Boolean} setProperty    When true, setProperty should set the height.
 */
pui.layout.Layout.prototype.assignHeights = function(setProperty){
  var height = document.documentElement.clientHeight + "px";  // clientHeight is always the currently-vertical height, minus window chrome
  this.layoutDiv.parentNode.style.height = height;
  document.body.style.height = height;
  document.body.parentNode.style.height = height;
  this.layoutDiv.style.height = height;
  if (setProperty)
    this.setProperty("height", height);
};

/**
 * Save data from pui.renderFormat to allow lazy loading widgets inside a layout.
 * Properties set here should not be ones set by grids. (rowNum, subfileRow, dataArrayIndex, highlighting)
 *   me.renderItems sets some others.
 *   onload should not be set, because it only fires for the main format.
 * @param {Object} parms
 * @returns {undefined}
 */
pui.layout.Layout.prototype.saveFormat = function(parms){
  this._renderParms = {
    active: parms.active,
    data: parms.data,
    designMode: parms.designMode,
    "errors": parms["errors"],
    "file": parms["file"],
    "fileId": parms["fileId"],
    lastFormat: parms.lastFormat,
    lastLayer: parms.lastLayer,
    "library": parms["library"],
    metaData: {
      screen: {
        "record format name": parms.metaData.screen["record format name"]
      }
    },
    "msgInfo": parms["msgInfo"],
    name: parms.name,
    ref: parms.ref,
    runOnload: parms.runOnload,
    subfiles: parms.subfiles
  };
};

/**
 * Store an item's properties so it can be rendered later. (Called by pui.renderFormat.) Makes a copy of the properties
 * and removes the .layout reference. Stores the item in a collection keyed to the specified container.
 * @param {Number} container  The layout's container number in which the item belongs. Zero-based index.
 * @param {Object} item       The rendering properties.
 * @returns {undefined}
 */
pui.layout.Layout.prototype.deferLazyChild = function(container, item){
  if (this._lazyChildren[container] == null){
    this._lazyChildren[container] = [];
  }
  var myid = this.layoutDiv.id;
  var itemCopy = {};
  // Copy item properties except references to the layout.
  for (var key in item){
    // If item is in this layout, then omit item's container and layout properties.
    //   (because item's container will be one in this layout)
    // If item is not in this layout, then include container and layout properties.
    //   (because it will be inside a grid or another layout that's inside this one.)
    if (item["layout"] != myid || (key != "container" && key != "layout" ) ){
      if (typeof item[key] == "object" && item[key] != null){
        try {
          itemCopy[key] = JSON.parse( JSON.stringify(item[key]) ); //Bound properties are objects.
        } catch(exc){}
      }else{
        itemCopy[key] = item[key];
      }
    }
  }
  this._lazyChildren[container].push(itemCopy);
};

/**
 * Render items for the currently visible containers if the items haven't already been rendered.
 * Called by layout template classes when visible container changes and once in pui.renderFormat (rendering the main format).
 * @param {Array|undefined} cnum    Index of container to render. When undefined, 
 * @returns {undefined}
 */
pui.layout.Layout.prototype.renderItems = function( cnum ){
  //All items have been rendered, or lazy load wasn't implemented for the layout, or saveFormat wasn't called yet.
  if (this._renderParms == null) return;
    
  // Look at each container specified by the layout template's class. (Usually only one is specified.)
  if (this._lazyChildren[cnum] != null && this.containers[cnum] != null){
    this._renderParms.container = this.containers[cnum];
    this._renderParms.lazyContainerNum = cnum;
    this._renderParms.metaData.items = this._lazyChildren[cnum];
    this._renderParms.onlazyload = this.onlazyload;
    pui.renderFormat(this._renderParms);
    delete this._lazyChildren[cnum]; //Prevents rendering same items again after they're already rendered.
  }
  
  // Free up format data from this widget once all items are rendered. Data could be large.
  if (Object.keys(this._lazyChildren).length == 0){
    this._renderParms = null;
  }
};

/**
 * Called by pui.cleanup. Dereference variables.
 */
pui.layout.Layout.prototype.destroy = function() {
  if (this.iScroll != null) this.iScroll["destroy"]();
  if (this.layoutDiv) delete this.layoutDiv.layout;  //Avoid methods being called on a destroyed Layout.
  this.deleteOwnProperties();
};


/**
 * Event handler for any events assigned to "this".
 * @param {Event} e
 */
pui.layout.Layout.prototype['handleEvent'] = function(e) {
  switch (e.type){
    case 'click': this._designOnClick(e); break;
  }
};

//
// end of Layout class.
//

/**
 * A super class for layout templates. Note: it would make more sense for templates to be implemented as subclasses
 * of pui.Layout, but many changes are required first. This can be used until then.
 * @param {Object|undefined} parms  Property setter parameters. May be undefined for responsive layout in the responsive editor.
 * @param {Element|undefined} dom   A new or cloned DIV element.
 * @constructor
 */
pui.layout.Template = function(parms, dom) {
  this.forProxy = (parms && parms.proxyMode);
  this.designMode = (parms && parms.designMode);
  
  if (dom) this.linkToDom(dom);
};
pui.layout.Template.prototype = Object.create(pui.BaseClass.prototype);

/**
 * Assign template-specific properties to a DOM element. called by applyTemplate in the pui.layout.Template constructor.
 * 
 * TODO: this approach seems overcomplicated:
 * templates get built on an object detached from the DOM and then properties from that DOM are copied onto an existing DOM element.
 * Why not just evaluate the template in the "field type" or "template" setters before constructing the appropriate Layout subclass.
 * Then you would know if the template is good, and there's no need to construct a fake one that you can back out of in case something 
 * goes wrong.
 * @param {Element} dom    Should not be null or undefined.
 */
pui.layout.Template.prototype.linkToDom = function(dom){
  this.container = dom;
  // "layoutT" lets pui.Layout and applyTemplate know that the dom contains this class.
  this.container.layoutT = this;
  
  // Various places in Designer call sizeMe when the layout needs to be sized--e.g. paste, drop in, move, etc.
  var layout = dom.layout;
  if (layout && typeof layout.resize === 'function') dom.sizeMe = layout.resize.bind(layout);
};

/**
 * Clean up any properties that this class added to the DOM, and then clear this.
 * So far this is only used in layoutWidget.js to cleanup things when a "template" property is called. If in the future this is 
 * called in other places, then be sure to test with layouts being in the backgrounds of transition animations. #5044.
 */
pui.layout.Template.prototype.destroy = function(){
  var deleteOwn = pui.BaseClass.prototype.deleteOwnProperties;
  // delete all properties added to this.container: sizeMe, layoutT, etc.
  if (this.container) deleteOwn.call(this.container);
  deleteOwn(this); //delete any properties added to "this" object.
};

/**
 * Change a property value of the design item associated with this layout and refresh the property window. Wrapper for subclasses.
 * @param {String} propertyName
 * @param {String} value
 * @returns {undefined|Boolean} 
 */
pui.layout.Template.prototype._updatePropertyInDesigner = function(propertyName, value){
  if (this.container && this.container.layout) return this.container.layout.updatePropertyInDesigner(propertyName, value);
};

/**
 * Assign list of containers to the Layout object. Unlike HTML templates, containers for Template subclasses may not be in the DOM 
 * until property setters run, after getContainers was called. Thus, the Layout must have containers set here.
 * 
 * Assume subclasses do not use "stretch".
 * 
 * This should be called when the number of containers change. (If the template sets a fixed number containers in the constructor,
 * then this function need not be called.)
 * @param {Array} containers
 */
pui.layout.Template.prototype._setContainers = function(containers){
  if (this.container && this.container.layout){
    this.container.layout.containers = containers;
  }
};

/**
 * Call setProperty for every property in parms.properties to ensure all are set in case the "template" property was called after others.
 * If "template" was a later property, then applyTemplate reconstructs the class, voiding any previous calls to setProperty,
 * which are not again called.  (Sub-classes should be able to handle properties being set in any order.)
 * @param {Object} parms
 */
pui.layout.Template.prototype.initialSetProperties = function(parms){
  var properties = parms.properties;
  if (properties){
    for (var pname in properties){
      this.setProperty(pname, properties[pname]);
    }
  }
};

/**
 * Placeholder for subclasses to implement and override. Each template needs to handle its template-specific properties; 
 * otherwise, the Layout's setProperty calls applyTemplate, rebuilding the layout.
 * Handle properties so that applyTemplate isn't called for every property being set, rebuilding the layout.
 * @param {String} property
 * @param {String} value
 * @param {Object} templateProps  A collection in pui.Layout with properties for this template.
 * @returns {Boolean}  When true is returned, the pui.Layout.prototype.setProperty will not process the property change any more.
 */
pui.layout.Template.prototype.setProperty = function(property, value, templateProps){
  return false;
};

/**
 * Placeholder for subclasses to implement and override. Called for each property after Layout and the Template setProperty methods.
 * @param {String} property
 * @param {String} value
 */
pui.layout.Template.prototype.setPropertyAfter = function(property, value){};

/**
 * Placeholder for subclasses to override. Called when the layout should update its own dimension-dependant styles.
 */
pui.layout.Template.prototype.resize = function() {};
