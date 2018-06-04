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


if (!window["Atrium"]) window["Atrium"] = new Object();

Atrium["launchURL"] = function(url, title, closable) {

  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;

  return awin["Atrium"]["api"]["launchURL"](url, title, closable); 
  
}

Atrium["closeTab"] = function(tab) {

  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;

  awin["Atrium"]["api"]["closeTab"](window, tab);

  
}

Atrium["launchItem"] = function(itemId, closable, callback) {

  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;

  return awin["Atrium"]["api"]["launchItem"](itemId, closable, callback);
  
}

Atrium["activateTab"] = function(tab) {

  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;

  awin["Atrium"]["api"]["activateTab"](tab);
  
}

Atrium["closeAllTabs"] = function(keepHomePage) {
  
  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;

  awin["Atrium"]["api"]["closeAllTabs"](window, keepHomePage);
  
}

Atrium["getCurrentTab"] = function() {
  
  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;

  return awin["Atrium"]["api"]["getCurrentTab"](window);
  
}

Atrium["getToken"] = function() {

  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;
  
  return awin["Atrium"]["api"]["getToken"]();

}

Atrium["getUser"] = function() {

  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;
  
  return awin["Atrium"]["api"]["getUser"]();  

}

Atrium["runPCCommand"] = function(command) {
  
  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;
  
  awin["Atrium"]["api"]["runPCCommand"](command);
  
}

Atrium["refreshNavPanel"] = function() {
  
  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;
  
  awin["Atrium"]["api"]["refreshNavPanel"]();
  
}

Atrium["setMenuFilter"] = function(value) {

  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;
  
  awin["Atrium"]["api"]["setMenuFilter"](value);

}

Atrium["breakMessagesShow"] = function(messages, userId){
  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;
  
  awin["Atrium"]["api"]["breakMessagesShow"](messages, userId);
};

Atrium["breakMessagesOnStorage"] = function(e){
  var awin = Atrium["getAtriumWindow"]();
  if (awin == null) return;
  
  awin["Atrium"]["api"]["breakMessagesOnStorage"](e);
};


Atrium["getAtriumWindow"] = function() {
  var par = window.parent;
  while (par != null && par != par.parent && (par["Atrium"] == null || par["Atrium"]["api"] == null)) {
    par = par.parent;
  }
  if (par == null || par["Atrium"] == null || par["Atrium"]["api"] == null) return null;
  return par;
}


Atrium["collapseNav"] = function() {
	var awin = Atrium["getAtriumWindow"]();
	awin["Atrium"]["api"]["collapseNav"]();
}
Atrium["expandNav"] = function() {
	var awin = Atrium["getAtriumWindow"]();
	awin["Atrium"]["api"]["expandNav"]();
}

Atrium["setTabTitle"] = function() {
  
  var awin = Atrium["getAtriumWindow"]();
  if (awin == null)
    return;
  if (arguments.length == 1)
    awin["Atrium"]["api"]["setTabTitle"](window, arguments[0]);
  else if (arguments.length == 2)
    awin["Atrium"]["api"]["setTabTitle"](arguments[0], arguments[1]);
  
}
