//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2015 Profound Logic Software, Inc.
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
var autoCompQueries = 0;

var yAdjust = -20;

var checkboxObjects = [];
var errors        = new Array();
var designScreens = new Array();
var usedIds       = new Object();

// prevent back button
if (context == "genie") window.history.forward(1);

// setup pui name space
window.pui = {};
{

  var agt = navigator.userAgent.toLowerCase();

  pui["is_ie"] = false;
  pui["is_opera"] = (agt.indexOf("opera") != -1 || agt.indexOf("opr/") != -1);
  pui["is_chrome"] = (agt.indexOf("chrome") != -1);
  pui["is_safari"] = (!pui["is_chrome"] && agt.indexOf("safari") != -1);
  pui["is_firefox"] = (agt.indexOf("firefox") != -1);
  pui["is_android"] = (agt.indexOf("android") != -1);
  pui["is_quirksmode"] = (document.compatMode == "BackCompat");
  
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
  
  regex = new RegExp("trident/([0-9]{1,}[\.0-9]{0,})");
  matches = regex.exec(agt);
  if (matches != null) {
  
    trident = parseFloat(matches[1]);
  
  }
  
  if (!pui["is_opera"]) { // Older Opera includes MSIE token.
  
    regex = new RegExp("msie ([0-9]{1,}[\.0-9]{0,})"); ;
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
  
}


pui["secLevel"] = 0;
pui.dummyBox = null;
pui.multX = null;
pui.multY = null;
pui.defaultDateFormat = "MM/DD/YY";
pui["is_touch"] = ("ontouchstart" in window);
pui.touchDevice = pui["is_touch"];  // for backward compatibility.

pui.designer = {};
pui.designer["initial keywords"] = [];   // for example, customer could change it as follows... pui.designer["initial keywords"] = ["INDARA"];
pui.designer.currentDisplay = {};
pui.ide = {};
pui.cnv = {};
pui.cnv.handlers = {};

// the definitions are here to handle the calls, however this is only needed in the design ide
pui.toolbox = {};
pui.toolbox.add = function() {};

pui["field exit key"] = 107;  // numeric pad plus sign

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

pui.usingGenieHandler = false;
pui.genieHandler = null;

pui["function key pattern"] = "^(F|CA|CF|CK|CMD)([0-9]{1,2})([=:-])(.*)$";
