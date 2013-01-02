
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

  this.addJSFile = function(path, callback) {
    if (typeof path != "string") return false;
    path = trim(path);
    if (path == "") return false;
    if (jsScripts[path] != null) return false;  // already there

    var done = false;
    var script = document.createElement("script");
    script.type= "text/javascript";
    script.onreadystatechange= function () {
      if (script.readyState == "complete" || script.readyState == "loaded") {
        if (!done && callback != null) callback();
        done = true;
      }
    }
    script.onload = function() {
      if (!done && callback != null) callback();
      done = true;
    };
    jsScripts[path] = script;
    script.src = path;
    head.appendChild(script);

    return true;
  }
  
  this.load = function(parms) {
    me.init();
    
    var props = null;
    var isDesignMode;
    if (parms != null) {
      isDesignMode = false;
      props = parms.metaData.screen;      
    }
    else {
      isDesignMode = true;
      props = toolbar.designer.screenProperties[toolbar.designer.currentScreen.screenId];      
    }
    
    var cssPaths = {};
    
    // get new css paths
    var idx = 1;
    var path = props["external css"];
    if (!isDesignMode) path = pui.evalBoundProperty(path, parms.data, parms.ref);
    while (path != null) {
      cssPaths[path] = true;
      idx++;
      path = props["external css " + idx];
      if (!isDesignMode) path = pui.evalBoundProperty(path, parms.data, parms.ref);
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
    var jsLoadCount = 0;
    if (isDesignMode != true) {
      idx = 1;
      path = pui.evalBoundProperty(props["external javascript"], parms.data, parms.ref);
      while (path != null) {
        var alreadyLoaded = me.addJSFile(path, function() {
          jsLoadCount -= 1;
          if (jsLoadCount != 0) return;

          // execute global onload event
          if (pui["onload"] != null && typeof pui["onload"] == "function") {
            pui["onload"](parms);
          }
        
          // execute format's onload event
        	var onloadProp = props["onload"];
        	if (onloadProp != null && onloadProp != "") {
        	  try {
        	    eval('var format = "' + props["record format name"] + '";');
        	    eval('var file = "' + parms.file + '";');
        	    eval(onloadProp);
        	  }
        	  catch(err) {
        	    pui.alert("Onload Error:\n" + err.message);
        	  }
        	}

        });
        if (alreadyLoaded) {
          parms.runOnload = false;  // don't run onload from render.js ... it will run here as a callback instead once all scripts are loaded
          jsLoadCount++;
        }
        idx++;
        path = pui.evalBoundProperty(props["external javascript " + idx], parms.data, parms.ref);
      }
    }
  }
  
}


pui.externalFiles = new pui.ExternalFiles();


