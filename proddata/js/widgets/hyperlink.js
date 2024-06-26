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

pui["encode hyperlink spaces"] = null;
pui["default hyperlink tabindex"] = null;

pui.buildHyperlink = function(dom, value, designMode, href, target, tabIdx, downloadFile) {
  dom.innerHTML = "";
  var a = document.createElement("a");
  var noHref = false;
  if (designMode == true || href == null || href.trim() === "") {
    href = "javascript:void(0)";
    noHref = true;
  }
  a.href = href;
  if (!designMode && target != null) a.target = target;
  var text = value;
  if ((context == "genie" && pui["encode hyperlink spaces"] != false) ||
       (pui["encode hyperlink spaces"] == true)) {
    text = text.replace(/ /g, "\u00a0");
  }

  if (typeof downloadFile === "string" && downloadFile.trim() !== "") {
    a["download"] = downloadFile;
  }

  a.appendChild(document.createTextNode(text));
  if (pui["is_old_ie"] && noHref && (context == "dspf" || context == "genie")) {
    addEvent(a, "click", function(e) {
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
      return false;
    });
  }

  // The "tab index" property sets the tab index on the <DIV> element.
  // But for it to work properly, it needs to be set on the <A> element.
  // If not set, use the config option
  if (tabIdx != null && tabIdx != "") {
    a.tabIndex = tabIdx;
  }
  else if (pui["default hyperlink tabindex"] != null) {
    a.tabIndex = pui["default hyperlink tabindex"];
  }

  dom.appendChild(a);
};

pui.widgets.add({
  name: "hyperlink",
  newValue: "Click Here",
  inlineEdit: true,
  defaults: {
    color: "#0066CC"
  },

  globalPropertySetter: function(parms) {
    switch (parms.propertyName) {
      case "color":
      case "font family":
      case "font size":
      case "font style":
      case "font variant":
      case "font weight":
      case "letter spacing":
      case "text align":
      case "text decoration":
      case "text transform":
      case "word spacing":
      case "background color":
        var words = parms.propertyName.split(" ");
        if (words.length == 2) words[1] = words[1].substr(0, 1).toUpperCase() + words[1].substr(1);
        var styleName = words.join("");
        var domObj = parms.dom;
        if (domObj.firstChild != null && domObj.firstChild.tagName == "A") {
          domObj.firstChild.style[styleName] = parms.value;
        }
        break;
    }
  },

  propertySetters: {

    "field type": function(parms) {
      pui.buildHyperlink(parms.dom, parms.evalProperty("value"), parms.design, parms.properties["hyperlink reference"], parms.properties["target"], parms.evalProperty("tab index"), parms.evalProperty("download file"));
      if (parms.design) {
        designUtils.addEvent(parms.dom, "mouseover", function() {
          setTimeout(parms.designItem.designer.selection.positionSizies, 0);
        });
        designUtils.addEvent(parms.dom, "mouseout", function() {
          setTimeout(parms.designItem.designer.selection.positionSizies, 0);
        });
      }
    },

    "value": function(parms) {
      pui.buildHyperlink(parms.dom, parms.value, parms.design, parms.properties["hyperlink reference"], parms.properties["target"], parms.evalProperty("tab index"), parms.evalProperty("download file"));
    }

  }

});
