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
 * Locales Class
 * @constructor
 */

pui.Locales = function() {
  // private variables
  var me = this;
  var localeArray = [];

  // public methods
  this.getLocales = function() {
    return localeArray;
  };
    
  this.add = function(obj) {
    var name = obj["name"];
    if (name !== null) {
      for(var i=0; i<localeArray.length; i++){
        if(obj["text"] < localeArray[i]["text"]){
          break;
        }
      }
      // add locale to the array where it belongs (alphabetically by name)
      localeArray.splice(i, 0, obj);
      me[name] = obj;
    }
  };
  
};

pui.locales = new pui.Locales();
