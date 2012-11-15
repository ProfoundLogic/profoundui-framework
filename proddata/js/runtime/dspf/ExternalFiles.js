
/**
 * External Files Class
 * @constructor
 */

pui.ExternalFiles = function() {
  var cssLinks = {};
  var jsScripts = {};
  var me = this;
  var head;
  
  this.init = function() {
    if (head == null) head = document.getElementsByTagName("head")[0];
  }

  this.addCSSFile = function(path) {
    if (typeof path != "string") return;
    path = trim(path);
    if (path == "") return;
    if (cssLinks[path] != null) return;  // already there
    var css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("media", "screen");
    css.setAttribute("href", path);
    cssLinks[path] = css;
    head.appendChild(css);
  }

  this.addJSFile = function(path) {
    if (typeof path != "string") return;
    path = trim(path);
    if (path == "") return;
    if (jsScripts[path] != null) return;  // already there
    var js = document.createElement("script");
    js.setAttribute("type","text/javascript");
    js.setAttribute("src", path);
    jsScripts[path] = js;
    head.appendChild(js);
  }
  
  this.load = function(format) {
    me.init();
    
    var props = null;
    var isDesignMode;
    if (format != null) {
      isDesignMode = false;
      props = format.metaData.screen;      
    }
    else {
      isDesignMode = true;
      props = toolbar.designer.screenProperties[toolbar.designer.currentScreen.screenId];      
    }
    
    var cssPaths = {};
    
    // get new css paths
    var idx = 1;
    var path = props["external css"];
    if (!isDesignMode) path = pui.evalBoundProperty(path, format.data, format.ref);
    while (path != null) {
      cssPaths[path] = true;
      idx++;
      path = props["external css " + idx];
      if (!isDesignMode) path = pui.evalBoundProperty(path, format.data, format.ref);
    }
    
    // unload old css paths if they aren't in the list of new paths
    var toUnload = [];
    for (var path in cssLinks) {
      if (cssPaths[path] != true) toUnload.push(path);
    }
    for (var i = 0; i < toUnload.length; i++) {
      var path = toUnload[i];
      var css = cssLinks[path];
      head.removeChild(css);
      delete cssLinks[path];
    }
    
    // load new css paths
    for (var path in cssPaths) {
      me.addCSSFile(path);
    }
    
    // load javascript files (there is never any unloading of javascript files and they are never loaded in design mode)
    if (isDesignMode != true) {
      idx = 1;
      path = pui.evalBoundProperty(props["external javascript"], format.data, format.ref);
      while (path != null) {
        me.addJSFile(path);
        idx++;
        path = pui.evalBoundProperty(props["external javascript " + idx], format.data, format.ref);
      }
    }
  }
  
}


pui.externalFiles = new pui.ExternalFiles();


