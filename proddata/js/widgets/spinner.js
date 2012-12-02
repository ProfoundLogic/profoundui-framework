

/**
 * Spinner Class
 * @constructor
 */

pui.Spinner = function(dom, minValue, maxValue, increment, runtimeMode) {

  // Private Properties / Constructor
  var me = this;
  var up = document.createElement("img");
  var down = document.createElement("img");
  
  if (minValue != null && minValue != "") {
    minValue = Number(minValue);
    if (isNaN(minValue)) minValue = null;
  }
  else {
    minValue = null;
  }
  if (maxValue != null && maxValue != "") {
    maxValue = Number(maxValue);
    if (isNaN(maxValue)) maxValue = null;
  }
  else {
    maxValue = null;
  }
  if (increment != null) {
    increment = Number(increment);
    if (isNaN(increment)) increment = 1;
    if (increment == 0) increment = 1;
  }
  else {
    increment = 1;
  }

  up.style.position = "absolute";
  up.className = "input";  // to pick up the default zIndex value
  up.style.borderStyle = "none";
  up.style.backgroundColor = "transparent";
  up.src = pui.normalizeURL("/profoundui/proddata/images/up.gif");
  up.style.cursor = "pointer";
  up.onclick = function() {
    me.spin(increment);
  }
  if (is_ie) {
    // in IE, a double-click does not send two onclick events
    up.ondblclick = function() {
      me.spin(increment);
    }
  }
    
  down.style.position = "absolute";
  down.className = "input";  // to pick up the default zIndex value
  down.style.borderStyle = "none";
  down.style.backgroundColor = "transparent";
  down.src = pui.normalizeURL("/profoundui/proddata/images/down.gif");
  down.style.cursor = "pointer";
  down.onclick = function() {
    me.spin(-increment);
  }
  if (is_ie) {
    // in IE, a double-click does not send two onclick events
    down.ondblclick = function() {
      me.spin(-increment);
    }
  }
  
  if (runtimeMode) {
    if (is_ie) {
      var width = dom.offsetWidth;
      width = width - 18;
      if (width < 16) width = 16;
      dom.style.width = width + "px";
    }
    else {
      dom.style.paddingRight = "16px";
      dom.style.boxSizing = "border-box";
      dom.style.MozBoxSizing = "border-box";
      dom.style.WebkitBoxSizing = "border-box";
    }
  }

  dom.extraDomEls = [up, down];

  if (dom.parentNode != null) {
    dom.parentNode.appendChild(up);
    dom.parentNode.appendChild(down);
  }

  // Public Properties
  
  // Public Methods
  this.positionSpinnButtons = function() {
    var left = parseInt(dom.style.left);
    if (isNaN(left)) left = 0;
    var top = parseInt(dom.style.top);
    if (isNaN(top)) top = 0;
    up.style.left = left +  dom.offsetWidth - 15 + "px";
    top += parseInt((dom.offsetHeight - 18) / 2);
    if (quirksMode) top -= 1;
    up.style.top = top + "px";
    up.style.zIndex = dom.style.zIndex;
    up.style.visibility = dom.style.visibility;

    left = parseInt(dom.style.left);
    if (isNaN(left)) left = 0;
    top = parseInt(dom.style.top);
    if (isNaN(top)) top = 0;
    down.style.left = left +  dom.offsetWidth - 15 + "px";
    top += 9;
    top += parseInt((dom.offsetHeight - 18) / 2);
    if (dom.offsetHeight % 2 == 1) {
      if (dom.offsetHeight < 18) top -= 1;
      else top += 1;
    }
    down.style.top = top + "px";
    down.style.zIndex = dom.style.zIndex;
    down.style.visibility = dom.style.visibility;
  }
  
  me.positionSpinnButtons();  // run this in the constructor
  
  this.hide = function() {
    up.style.visibility = "hidden";
    down.style.visibility = "hidden";
  }
  
  this.show = function() {
    up.style.visibility = "";
    down.style.visibility = "";
  }

  this.spin = function(byValue) {
    if (dom.disabled) return;
    if (dom.readOnly) return;
    var num = Number(dom.value);
    if (isNaN(num)) num = 0;
    num += byValue;
    num = Math.round(num * 10000) / 10000;
    if (minValue != null && num < minValue) num = minValue;
    if (maxValue != null && num > maxValue) num = maxValue;
    var maxLen = Number(dom.getAttribute("maxLength"));
    if (maxLen != null && !isNaN(maxLen) && maxLen > 0) {
      if (maxLen == 1 && num < 0) num = 0;
      if (String(num).length > maxLen) return;
    }
    dom.value = num;
    dom.modified = true;
    if (context == "genie" && dom.fieldInfo != null && dom.fieldInfo["idx"] != null) {
      pui.response[dom.fieldInfo["idx"]] = dom;
    }

    // try { dom.focus() } catch(e) { };
    var onspin = dom["onspin"];
    if (onspin != null) onspin();
    
    pui.checkEmptyText(dom);    
  }

}



pui.widgets.add({
  name: "spinner",
  tag: "input",
  pickIcon1: pui.normalizeURL("/profoundui/proddata/images/up.gif"),
  pickIcon2: pui.normalizeURL("/profoundui/proddata/images/down.gif"),
  defaults: {
    "css class": "input"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (!parms.design) {
        setTimeout( function() { 
          parms.dom.spinner = new pui.Spinner(parms.dom, parms.evalProperty("min value"), parms.evalProperty("max value"), parms.evalProperty("increment value"), !parms.design);
        }, 1);
      }
      if (parms.design) parms.dom.readOnly = true;
    },
    
    "value": function(parms) {
      parms.dom.value = parms.value;
    }

  }
  
});

