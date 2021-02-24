//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2021 Profound Logic Software, Inc.
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
 * A simple fieldset with a legend and a DIV element acting as the container.
 * @param {Object} parms  Property setter parameters.
 * @param {Element} dom   A new or cloned DIV element.
 * @constructor
 */
pui.FieldsetLayout = function(parms, dom) {
  pui.layout.Template.call(this, parms, dom);  //sets this.container, etc.
  
  this._fieldset = document.createElement('fieldset');
  this._fieldset.className = 'layout';
  
  this._legend = document.createElement('legend');
  this._fieldset.appendChild(this._legend);
  
  this._div = document.createElement('div');
  this._div.setAttribute('container', 'true');
  this._fieldset.appendChild(this._div);
  
  this.container.appendChild(this._fieldset);
};
pui.FieldsetLayout.prototype = Object.create(pui.layout.Template.prototype);


pui.FieldsetLayout.prototype.setProperty = function(property, value){
  var ret = true;
  switch (property){
    case 'legend':
      this._legend.innerHTML = value;
      break;
      
    case 'legend align':
      // Note: legend align has been deprecated in HTML5. The equivalent in CSS requires a bunch of style rules that could be done in the future.
      this._legend.setAttribute('align', value);
      break;
      
    case 'legend style':
      this._legend.style = value;
      break;
    
    case 'border style':
      this._fieldset.style.borderStyle = value;
      break;
      
    case 'border width':
      this._fieldset.style.borderWidth = value;
      break;
      
    case 'border color':
      this._fieldset.style.borderColor = value;
      break;
      
    default:
      ret = false;
      break;
  }
  return ret;
};
