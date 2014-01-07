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
 * Session Class
 * @constructor
 */

function Session() {
  // Public Properties
  var cookieName = "GenieSession";
  if (context == "dspf") cookieName = "PUISession";
  var loaded = false;
  
  // Private Properties
  var state = {};  // state object to store all values
  
  function set(variable, value) {
    state[variable] = value;
  }
  
  function get(variable, defaultValue) {
    var value = state[variable];
    if (value == null) value = defaultValue;
    if (value == null) value = "";
    return value;
  }
  
  // save the state object to a cookie
  function save() {
    var json = "{ ";
    var count = 0;
    for (var variable in state) {
      count++;
      var value = state[variable];
      if (count > 1) json += ", ";
      json += variable + ":";
      json += '"';
      json += value;
      json += '"';
    }
    json += " }";
    document.cookie = cookieName + "=" + escape(json) +  "; path=/";
  }
  
  // load the state from a cookie
  function load() {
    var json = null;
    // cookies are separated by semicolons
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++) {
      // a name/value pair (a crumb) is separated by an equal sign
      var aCrumb = aCookie[i].split("=");
      if (cookieName == aCrumb[0]) 
        json = unescape(aCrumb[1]);
    }
    if (json == null) {
      state = {};
    }
    else {
      try {
        //eval("state = " + json + ";"); 
        state = eval("(" + json + ")");
      }
      catch(err) {
        state = {};
      }
    }
    loaded = true;
  }

  this.saveValue = function(variable, value) {
    if (!loaded) load();
    set(variable, value);
    save();
  }
  
  this.getValue = function(variable, defaultValue) {
    if (!loaded) load();
    return get(variable, defaultValue);
  }
  
  this.clear = function() {
    state = {};
    save();
  }
  
  // synonyms
  this.setValue = this.saveValue;
  this.set = this.saveValue;
  this.put = this.saveValue;
  this.get = this.getValue;  
  
}

var session = new Session();

window["session"] = session;
window["session"]["saveValue"] = session.saveValue;
window["session"]["getValue"] = session.getValue;
window["session"]["clear"] = session.clear;
window["session"]["setValue"] = session.setValue;
window["session"]["set"] = session.set;
window["session"]["put"] = session.put;
window["session"]["get"] = session.get;