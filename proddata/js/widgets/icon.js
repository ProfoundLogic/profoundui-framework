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
function handleIcon(value, parms) {
    if (value) value = trim(value);
    if (value.substr(0,9) == 'material:') {
        icon = value.substr(9);
        parms.dom.innerText = trim(icon);
        //remove any font awesome icon if there
        pui.removeCssClass(parms.dom, 'pui-fa-icons');
        if (parms.dom.faIcon) pui.removeCssClass(parms.dom, 'fa-' + parms.dom.faIcon);
        var className = parms.dom.className;
        parms.dom.className = className + " pui-material-icons";
    } else if(value.substr(0,12) == 'fontAwesome:') {
        icon = trim(value.substr(12));
        //remove any material icon if there
        pui.removeCssClass(parms.dom, 'pui-material-icons');
        if (parms.dom.faIcon) {
            pui.removeCssClass(parms.dom, 'pui-fa-icons');
            pui.removeCssClass(parms.dom, 'fa-' + parms.dom.faIcon);
        }
        var className = parms.dom.className;
        parms.dom.faIcon = icon;
        parms.dom.className = className + ' pui-fa-icons fa-' + icon;
        parms.dom.innerText = '';
    }
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
            var value = parms.evalProperty("icon");
            handleIcon(value, parms);
            parms.dom.style.textAlign = "center";
        },
        "icon": function(parms) {
            var value = parms.value;
            handleIcon(value, parms);
        },
        "width": function(parms) {
            if(parseInt(parms.value) <= parseInt(parms.dom.style.height)) {
                parms.dom.style.fontSize = parms.value;
            }
            else {
                parms.dom.style.fontSize = parms.dom.style.height;
            }   
        },
        "height": function(parms) {
            if(parseInt(parms.value) <= parseInt(parms.dom.style.width)) {
                parms.dom.style.fontSize = parms.value;
            }
            else {
                parms.dom.style.fontSize = parms.dom.style.width;
            }
        }
    }
});
