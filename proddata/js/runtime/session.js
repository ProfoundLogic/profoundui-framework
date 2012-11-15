
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