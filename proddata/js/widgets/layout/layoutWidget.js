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

pui.widgets.add({
  name: "layout",
  canBelongToGrid: false,
  defaults: {
  },

  globalPropertySetter: function(parms) {
    if (parms.dom.layout == null) {
      parms.dom.layout = new pui.layout.Layout();
      parms.dom.layout.layoutDiv = parms.dom;
      parms.dom.layout.designItem = parms.designItem;
      if (parms.design) {
        parms.designItem.multipleSelection = false;
      }
    }
    var layout = parms.dom.layout;

    if (!parms.design && parms.propertyName == "field type") {
      parms.dom.layout.setProperty("center vertically", parms.properties["center vertically"]);
      parms.dom.layout.setProperty("center horizontally", parms.properties["center horizontally"]);
    }

    var setProperty = true;
    // Note: depending on how the RDF JSON was stored, the "template" property could be set after other properties, causing the instance to be rebuilt.
    if (parms.propertyName == "field type" || parms.propertyName == "template") {
      parms.dom.style.padding = "0px";
      parms.dom.style.borderWidth = "0px";

      // we assume we want 100% height for browser viewport (should we remove these properties once this screen has finished?)
      if (!parms.design && parms.properties["height"] == "100%" && parms.dom.parentNode.id == "pui") {
        // If height is unset, IE returns "auto", and all others return "0px"

        var parentStyle = pui.getComputedStyle(parms.dom.parentNode);
        if (parentStyle != null && (parentStyle["height"] == "0px" || parentStyle["height"] == "auto")) {
          pui.restoreStyles["padding"] = document.body.style.padding;
          document.body.style.padding = "0";
          pui.restoreStyles["height"] = document.body.style.height;
          document.body.style.height = "100%";
          document.body.parentNode.style.padding = "0";
          document.body.parentNode.style.height = "100%";
          pui.restoreStyles["overflow"] = document.body.style.overflow;
          document.body.style.overflow = "hidden";
          parms.dom.parentNode.style.padding = "0";
          parms.dom.parentNode.style.height = "100%";
        }

        // Phonegap/Mobile Client is buggy on iOS when using 100% height, so we assign the height in pixels
        // pui.resize also sets these values upon resize.
        if (window["cordova"] && window["device"]["platform"] == "iOS") {
          parms.dom.layout.assignHeightOnResize = true;
          parms.dom.parentNode.style.overflowX = "hidden";
          parms.dom.parentNode.style.overflowY = "hidden";
          parms.dom.layout.assignHeights(); // Set the height of the document and other elements.
        }
      }
      else if (!parms.design && parms.dom.parentNode.isPUIWindow &&
               (pui.isPercent(parms.properties["height"]) ||
                pui.isPercent(parms.properties["width"]))) {
        parms.dom.parentNode.style.width = "100%";
        parms.dom.parentNode.style.height = "100%";
      }

      if (parms.design) {
        if (!parms.dom.layout.designMode) {
          parms.dom.layout.enableDesign();
        }
        parms.dom.designItem = parms.designItem;
        parms.designItem.multipleSelection = false;
        if (parms.propertyName == "field type") {
          parms.dom.layout.setProperty("width", parms.properties["width"]);
          parms.dom.layout.setProperty("height", parms.properties["height"]);

          if (parms.properties["inline style"]) {
            pui.addInlineCSS(parms.dom, parms.properties["inline style"], true);
          }
        }
      }
      parms.dom.layout.previousTemplate = parms.dom.layout.template;
      parms.dom.layout.template = parms.properties["template"];
      var savedTemplateName = null;
      if (parms.propertyName == "template") {
        savedTemplateName = parms.dom.layout.template;
        parms.dom.layout.template = parms.value;
        // The template switched. Note: there is no need to destroy the old layoutT because a new one gets created when applyTemplate
        // runs. If you were to destroy the layoutT here, then using the widget causes errors after switching templates. PUI-213
      }
      var nmodel = makeNamedModel(pui.layout.getPropertiesModel());
      for (var prop in parms.properties) {
        if (!nmodel[prop]) parms.dom.layout.templateProps[prop] = parms.properties[prop];
      }
      var rv = parms.dom.layout.applyTemplate();
      if (rv.success == false && savedTemplateName != null) {
        // The template change could not be applied, so restore the old value of the "template" property.
        layout.template = savedTemplateName;

        // Rollback the change. Use a delay because other events in propertyWindow may fire later and overwite this rollback.
        setTimeout(layout.updatePropertyInDesigner.bind(layout), 1, "template", savedTemplateName);

        setProperty = false;
      }
      if (rv.success == true && (!parms.design || toolbar.loadingDisplay || toolbar.pastingFormat)) {
        parms.dom.layout.containers = rv.containers;
      }
    }
    if (setProperty) parms.dom.layout.setProperty(parms.propertyName, parms.value);
  },

  globalAfterSetter: function(parms) {
    var dom = parms.dom;
    if (dom) {
      var layoutT = dom.layoutT;
      if (layoutT) {
        layoutT.setPropertyAfter(parms.propertyName, parms.value);
      }
    }
  },

  initialize: function(parms) {
    if (parms.design) return;
    var dom = parms.dom;
    var id = dom.id;
    if (id == null) id = "";
    var cls = dom.className;
    if (cls == null) cls = "";
    if (id.toLowerCase() == "scroller" || cls.toLowerCase() == "scroller") {
      if (!pui["is_old_ie"]) { // the iScroll component can crash in IE
        dom.layout.applyScrolling();
      }
    }
  }

});
