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
function handleIcon(parms) {
    var iconValue = parms.evalProperty("icon");
    var cssClass = parms.evalProperty("css class");
    var iconSize = parms.evalProperty("icon size");
    var iconDiv = document.createElement('div');
    // Remove the previous icon if it exists
    parms.dom.innerHTML = ''; 

    if (iconValue) iconValue = trim(iconValue);
    if (iconValue.substr(0,9) == 'material:') {
        var icon = iconValue.substr(9);
        iconDiv.innerText = trim(icon);
        iconDiv.className = 'pui-material-icons';
    } else if(iconValue.substr(0,12) == 'fontAwesome:') {
        var icon = trim(iconValue.substr(12));
        iconDiv.className = 'pui-fa-icons fa-' + icon;
        iconDiv.innerText = '';
    }
    // Add the first css class set in the properties
    if (cssClass) iconDiv.className = iconDiv.className + ' ' + cssClass;
    // Set the last size set in the designer
    if (iconSize) iconDiv.style.fontSize = iconSize;
    parms.dom.appendChild(iconDiv);
}

function handleIconResize(parms, sizeType) {
    var iconDiv = parms.dom.firstChild;
    if(parseInt(parms.value) <= parseInt(parms.dom.style[sizeType]))
        iconDiv.style.fontSize = parms.value;
    else 
        iconDiv.style.fontSize = parms.dom.style[sizeType];
    
    parms.properties["icon size"] = iconDiv.style.fontSize;
}

pui.widgets.add ({
    name: "icon",
    newId: "Icon",
    tag: "div",
    defaults: {
        "icon": "material:face"
    },
    propertySetters: {
        "field type": function(parms) {
            handleIcon(parms);
            parms.dom.style.textAlign = "center";
        },
        "icon": function(parms) {
            parms.properties["icon"] = parms.value;
            handleIcon(parms);
        },
        "width": function(parms) {
            // check against height to set size
            handleIconResize(parms, 'height');
        },
        "height": function(parms) {
            // check against width to set size
            handleIconResize(parms, 'width');
        },
        "css class": function(parms) {
            parms.properties["css class"] = parms.value;
            handleIcon(parms);
        }
    }
});
