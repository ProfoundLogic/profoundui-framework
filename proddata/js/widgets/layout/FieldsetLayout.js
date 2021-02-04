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
  pui.layout.Template.call(this, parms, dom);
  
  this._fieldset = document.createElement('fieldset');
  this._fieldset.className = 'layout';
  
  // TODO: 
  var properties = parms.properties;
//  if (properties['border style'])
  
  //this.container
  
  // Set properties based on the parms.properties
};
pui.FieldsetLayout.prototype = Object.create(pui.layout.Template.prototype);


pui.FieldsetLayout.prototype.setProperty = function(property, value){
  var ret = true;
  switch (property){
    case 'border style':
      this._fieldset.style.borderStyle = value;
      break;
      
    default:
      ret = false;
      break;
  }
  return ret;
};


//pui.layout["templates"]["fieldset"] = "<fieldset style=\"" +
//  " border-width:{property:'border width', choices:['1px','2px','3px','Other...'], defaultValue:'1px', helpDefault: '1px', help: 'The width of the element&apos;s border.'};" +
//  " border-color:{property:'border color', type:'color', defaultValue:'black', helpDefault: 'black', help: 'The color of the element&apos;s border.'};"
//  //Note: legend align has been deprecated in HTML5. The equivalent in CSS requires a bunch of style rules that aren't easily done in a plain HTML template.
//  //In the future, this template may need to be implemented in JavaScript.
//  +
//  '"><legend align="{property: \'legend align\', choices:[\'left\',\'right\',\'center\'], helpDefault: \'left\', help: \'The width of the element&apos;s border.\'}"' +
//  ' style="{property:\'legend style\', help:\'Styling for the legend text.\', type:\'long\'}">' +
//  '{property: "legend", helpDefault:\'Field Set\', help: \'Text to display in the field set&apos;s legend.\', "translate": true}</legend>' +
//  '<div container="true" style="width:100%; height:100%; position:absolute; overflow:hidden;"></div>' +
//  '</fieldset>';