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

// Number of outstanding auto complete queries.
// eslint-disable-next-line no-unused-vars
var autoCompQueries = 0;

// eslint-disable-next-line no-unused-vars
var yAdjust = -20;

// eslint-disable-next-line no-unused-vars
var errors = [];
// eslint-disable-next-line no-unused-vars
var designScreens = [];
// eslint-disable-next-line no-unused-vars
var usedIds = {};

// prevent Genie from being loaded via the back button.
// Note: in Atrium, history.forward(1) causes the parent Atrium window to navigate forward
// when loading a tab containing Genie. Other tabs are lost. Assume an iframe containing Genie
// is used for only the Genie session. So don't modify history for Genie tabs in iframes. Issue 2671.
if (context == "genie" && window.parent == window) window.history.forward(1);

// setup pui name space
var serverURL = typeof window.pui == "object" ? pui["serverURL"] : null;
window.pui = {};
if (serverURL) pui["serverURL"] = serverURL;

(function() {
  var agt = navigator.userAgent.toLowerCase();

  pui["is_edge"] = agt.indexOf("edg/") != -1; // Chromium Edge uses "Edg/", and pre-Chromium uses "Edge/". #6054.
  pui["is_ie"] = false;
  pui["is_opera"] = (agt.indexOf("opera") != -1 || agt.indexOf("opr/") != -1);
  pui["is_chrome"] = (!pui["is_edge"] && agt.indexOf("chrome") != -1);
  pui["is_safari"] = (!pui["is_edge"] && !pui["is_chrome"] && agt.indexOf("safari") != -1);
  pui["is_firefox"] = (agt.indexOf("firefox") != -1);
  pui["is_android"] = (agt.indexOf("android") != -1);
  pui["is_quirksmode"] = (document.compatMode == "BackCompat");
  pui["is_ios"] = (agt.indexOf("iphone") != -1 || agt.indexOf("ipad") != -1 || agt.indexOf("ipod") != -1);

  // Looking at Trident will give the actual version of IE that is used,
  // regardless of compatability view and document mode. Sometimes this is an
  // important distinction.

  // IE >=8 includes Trident in the user agent string. IE8 is Trident/4.0.
  // The Trident version increments along with IE version from there.
  // The IE user agent string drops the MSIE token starting with IE11.

  // See here for old IE user agent:

  // http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx

  // And notes on changes for IE11:

  // http://msdn.microsoft.com/en-us/library/ie/bg182625(v=vs.85).aspx#uaString

  var regex;
  var trident;
  var msie;
  var matches;

  regex = /trident\/([0-9]{1,}[.0-9]{0,})/;
  matches = regex.exec(agt);
  if (matches != null) {
    trident = parseFloat(matches[1]);
  }

  if (!pui["is_opera"]) { // Older Opera includes MSIE token.
    regex = /msie ([0-9]{1,}[.0-9]{0,})/;
    matches = regex.exec(agt);
    if (matches != null) {
      msie = parseFloat(matches[1]);
    }
  }

  if (trident || msie) {
    pui["is_ie"] = true;
    pui["ie_mode"] = msie || trident + 4;
    // This flag will be used to replace our old 'is_ie'. It seems that it's
    // pretty safe to assume most IE checks are no longer necessary with IE11.
    if (pui["ie_mode"] < 11) {
      pui["is_old_ie"] = true;
    }
    pui["ie_version"] = (trident) ? trident + 4 : msie;
  }
})();

pui["secLevel"] = 0;
pui.dummyBox = null;
pui.multX = null;
pui.multY = null;
pui.defaultDateFormat = "MM/DD/YY";
pui["is_touch"] = ("ontouchstart" in window);
pui.touchDevice = pui["is_touch"]; // for backward compatibility.
pui["is_mouse_capable"] = false; // default to false

pui.designer = {};
pui.designer["initial keywords"] = []; // for example, customer could change it as follows... pui.designer["initial keywords"] = ["INDARA"];
pui.designer.currentDisplay = {};
pui.ide = {};
pui.cloud = {};
pui.cloud.views = {};
pui.social = {};
pui.cnv = {};
pui.cnv.handlers = {};
pui.longFieldNameTable = {};
// the definitions are here to handle the calls, however this is only needed in the design ide
pui.toolbox = {};
pui.toolbox.add = function() {};

pui["field exit key"] = 107; // numeric pad plus sign
pui["field exit minus key"] = 109; // numeric pad minus sign

pui["no connection status"] = false;

pui["client side timeout"] = true;

pui.SQLDateFmts = {

  "*ISO": 1,
  "*USA": 2,
  "*EUR": 3,
  "*JIS": 4,
  "*MDY": 5,
  "*DMY": 6,
  "*YMD": 7,
  "*JUL": 8,
  "*JOB": 10

};

pui.SQLDateSeps = {

  "/": 1,
  "-": 2,
  ".": 3,
  ",": 4,
  " ": 5,
  "*BLANK": 5,
  "*JOB": 7

};

pui.SQLTimeFmts = {

  "*ISO": 1,
  "*USA": 2,
  "*EUR": 3,
  "*JIS": 4,
  "*HMS": 9

};

pui.SQLTimeSeps = {

  ".": 3,
  ",": 4,
  " ": 5,
  "*BLANK": 5,
  ":": 6,
  "*JOB": 7

};

pui.reservedWords = [
  "abstract", "arguments", "await", "boolean", "break", "byte", "case", "catch", "char", "class",
  "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "eval",
  "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if",
  "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native",
  "new", "null", "package", "private", "protected", "public", "return", "short", "static",
  "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try",
  "typeof", "var", "void", "volatile", "while", "with", "yield"
];

pui.usingGenieHandler = false;
pui.genieHandler = null;

pui["function key pattern"] = "^(F|CA|CF|CK|CMD)([0-9]{1,2})([=:-])(.*)$";
pui["special key pattern"] = "^(Enter|PageUp|PageDown|Rollup|RollDown|RollDn|PgUp|PgDn|Help|Print)([=-])(.*)$";

pui.sessionRetryCount = 0;
pui["session timeout retries"] = 0;

pui.dependenciesLoading = 0; // Counter for widget dependency files being loaded in pre-rendering time.

pui.nodejs = false;

pui.cloudSite = "profoundjs.com"; // The domain that Profound.js Spaces runs under.

// Namespace needed for creating SVG elements and polygons, circles, etc. Used in Designer Responsive Layout Editor, Join Editor, etc.
pui.SVGNS = "http://www.w3.org/2000/svg";

// Cross-ref to look up the "real" property name when a "display name" is used.
pui.propertyAlias = {};

pui["text file name pattern"] = /.+\.(css|js|json|html|htm|xml|txt|csv|sh|md|sql|scn|lst|xml|conf|php|log|ts|less|scss|cpp|ejs|vue|ts|jsx)$/i;

// config option to 'allow field exit' everywhere without setting the property on
// every widget
pui["always allow field exit"] = false;

pui["dup"] = {};
pui["dup"]["char"] = "\u25CF"; // this is a character that looks like a round circle
pui["dup"]["keyCode"] = 45; // Insert (the default dup key is Shift-Insert)
pui["dup"]["shift"] = true;
pui["dup"]["ctrl"] = false;
pui["dup"]["alt"] = false;

pui.wf = {
  qTypes: {}, // question types
  selectionSources: {},
  plugins: {},
  addPlugin: function(plugin) {
    var plugins = pui.wf.plugins;
    var category = plugin.category;
    if (!plugins[category]) plugins[category] = {};
    plugins[category][plugin.name] = plugin;
  }
};

// Controls whether style properties (such as text transform) apply
// to both the input box and choices list of a combo box, or whether
// it only applies to the input box.
pui["add combo style properties to choice list"] = true;
